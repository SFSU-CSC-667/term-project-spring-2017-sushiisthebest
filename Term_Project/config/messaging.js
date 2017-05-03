/**
 * Created by euphoric on 4/21/17.
 */
const socketIo = require('socket.io');

const socketioJwt = require('socketio-jwt');

const broadcast = require('../config/messaging');

const Games = require('../Models/Games');

const init = (app, server) => {
    const io = socketIo(server);
    const gameio = io.of('/game');

    gameio.on('connection', socket => {
        console.log('socket connected:',socket);

        socket.on('join-game', gameID => {
            socket.join(gag
        });

        socket.on('disconnect', data => {
            console.log('client disconnected');
        });

    });

    console.log('io set');
    app.set('io', io);

    io.on('connection', socket => {
        console.log('client connected');

        socket.on('disconnect', data => {
            console.log('client disconnected');
        });

        socket.on('create-game', function(game){

        });

        socket.on('check-game-status' , data => {
            Games.findGameByID(data.gameID)
                .then(game => {
                    if(game.playercount != 5 && game.hasstarted == false){
                        broadcast(io, 'status-check-success', game);
                    }
                })

        })

    })

};


module.exports = {init};