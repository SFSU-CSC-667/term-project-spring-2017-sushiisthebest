/**
 * Created by euphoric on 5/6/17.
 */
const socket = io.connect();

socket.on('connect', ()=> {
    const msg = {room: localStorage.getItem('current-game-id'), username: localStorage.getItem('username')};

    socket.emit('join', msg);
});

socket.on('user-joined', (data) =>{
    console.log(data);
    console.log(document.URL);
    $('#players').load(document.URL + ' #players')
});


