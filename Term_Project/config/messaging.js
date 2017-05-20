/**
 * Created by euphoric on 4/21/17.
 */
const socketIo = require('socket.io');

const socketioJwt = require('socketio-jwt');

const broadcast = require('../config/messaging');

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
           socket.join(data.username);
           socket.username = data.username;
           socket.to(data.room).emit('user-joined', data.username);
       });

        socket.on('disconnect', data => {
            console.log('client disconnected');
        });

        socket.on('send-message', data => {
            socket.to(data.room).emit('add-message', data);
        });

        //TODO ADD MORE ANIMATION EMITS TO THESE
        socket.on('me', data => {
            io.in(data.room).emit('player-damaged', data);
        });

        socket.on('king', data => {
            io.in(data.room).emit('player-damaged', data);
        });
        socket.on('dudes', data => {
            console.log(data);
            io.in(data.room).emit('player-damaged', data.players);
        });

        socket.on('wenches', data => {
            io.in(data.room).emit('player-damaged', data);
        });
        socket.on('mate', data => {

        });



        socket.on('bomb', data => {
            io.in(data.room).emit('bomb-animation', data);
        });

        socket.on('hover-player', data => {
            io.in(data.room).emit('on-target', data.playerID);
        });

        socket.on('unhover-player', data=> {
            io.in(data.room).emit('off-target', data.playerID);
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