/**
 * Created by euphoric on 4/21/17.
 */
const socketIo = require('socket.io');
const socket_io_JWT = require('socketio-jwt');

const init = (app, server) => {
    const io = socketIo(server);
    console.log('hello');

    app.set('io', io);

    io.on('connection', socket => {
        console.log('client connected');

        socket.on('disconnect', data => {
            console.log('client disc')
        })

        socket.emit('send-token', {msg: 'Requesting Token From Client'});

        socket.on('auth', data => {
            console.log(data);
        })



    })


    // io.on('auth', token =>{
    //     console.log(token);
    // })

};


module.exports = {init};