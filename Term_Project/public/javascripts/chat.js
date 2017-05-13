/**
 * Created by euphoric on 5/6/17.
 */
const socket = io.connect();
const FADE_TIME = 150;
let connected = false;


$(function () {
    //init
    let $input = $('.input-messages');
    $input.keydown( event => {
        if(event.keyCode === 13) { console.log('enter pressed'); sendMessage()}
    });

    let $messages = $('.messages');


socket.on('connect', ()=> {
    const msg = {room: localStorage.getItem('current-game-id'), username: localStorage.getItem('username')};
    connected = true;
    socket.emit('join', msg);
});



function sendMessage(){
    let msg = $input.val();
    msg = cleanInput(msg);
    const data = {username:localStorage.getItem('username'), message: msg, room: localStorage.getItem('current-game-id')};

    console.log('msg after cleaning:' , msg);

    if (msg && connected) {
        $input.val('');
        addNewMessage(data);
        console.log('---sending msg---');
        socket.emit('send-message', data);
    }
}



function addNewMessage(data) {
    let username = localStorage.getItem('username');

    let $usernameDiv = $('<span class = "username"/>')
        .text(data.username);

    let $messageBodyDiv = $('<span class = "messageBody"/>')
        .text(data.message);

    let $messageDiv = $('<li class  = "message"/>')
        .data('username', data.username)
        .append($usernameDiv, $messageBodyDiv);

    addElement($messageDiv)
}

function addElement(element){
    let $element = $(element).hide().fadeIn(FADE_TIME);

    $messages.append($element);

    $messages[0].scrollTop = $messages[0].scrollHeight;
}


//idea taken from socket.io demos
function cleanInput(input) {
    return $('<div/>').text(input).text();
}

socket.on('user-joined', (data) =>{
    console.log(data);
    console.log(document.URL);
    $('#players').load(document.URL + ' #players')
});

socket.on('add-message', data => {
   addNewMessage(data);
});

socket.on('reconnect' , () =>{
    console.log('you have been reconnected');
});

});









