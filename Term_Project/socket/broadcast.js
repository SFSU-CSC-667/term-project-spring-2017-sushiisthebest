/**
 * Created by euphoric on 5/1/17.
 */
const broadcast = (io, room, message, data) => {
    console.log('broadcast', room, message, data);


    //TODO UNDERSTAND THE DIFFERENCE BETWEEN io and Socket emit
    io.in(room).emit(message, data)

};

module.exports = broadcast;

