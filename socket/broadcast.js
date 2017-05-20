/**
 * Created by euphoric on 5/1/17.
 */
const broadcast = (io, room, message, data) => {
    console.log('broadcast', room, message, data);

    io.in(room).emit(message, data)
};

module.exports = broadcast;

