/**
 * Created by euphoric on 4/21/17.
 */
const socketIo = require('socket.io');

const socketioJwt = require('socketio-jwt');

const broadcast = require('../config/messaging');

const Games = require('../Models/Games');

const init = (app, server) => {
    const io = socketIo(server);
    const gameIO = io.of('/game');
    console.log('io set');
    app.set('io', io);
    console.log('game namespace set');
    app.set('gameio', gameIO);

    io.on('connection', socket => {

       socket.on('join', data => {
           console.log('socket joining room',data.room);
           socket.join(data.room);
           socket.username = data.username;
           socket.to(data.room).emit('user-joined', data.username);
       })

        socket.on('disconnect', data => {
            console.log('client disconnected');
        })

        socket.on('send-message', data => {
            socket.to(data.room).emit('add-message', data);
        })
    });





    gameIO.on('connection', socket => {
        console.log('socket connected:',socket);

        socket.on('join-game', gameID => {
            socket.join(gameID);
        });

        socket.on('disconnect', data => {
            console.log('client disconnected');
        });

    });



};


module.exports = {init};