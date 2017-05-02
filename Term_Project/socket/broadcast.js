/**
 * Created by euphoric on 5/1/17.
 */
const broadcast = (io, channel, message) => {
    console.log('broadcast', channel, message);


    //TODO UNDERSTAND THE DIFFERENCE BETWEEN io and Socket emit
    io.emit(channel, message)

};

module.exports = broadcast;

