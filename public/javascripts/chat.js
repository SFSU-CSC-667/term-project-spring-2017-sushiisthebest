const socket = io.connect();
const FADE_TIME = 150;
let connected = false;
let hasStarted = false;
let myTurn = false;
let targetable = false;
let currentAction = undefined;
let drawn = false;

$(function () {

    let $input = $('.input-messages');
    let $gameWindow = $('div#game-window');

    $gameWindow.on('keydown','input.input-messages', event => {
        if(event.keyCode === 13) {
            console.log('enter-pressed');
            console.log('value being sent',event.target.value);
            sendMessage(event.target.value);
            event.target.value = '';
        }
     });

//targeting mechanizm
    $gameWindow.on('click', '.box1', event => {
       if(myTurn && targetable){
        target(event.currentTarget.id);
       }
    });

    $gameWindow.on('mouseenter', 'div.box1', event =>{
        console.log('targetable:', targetable);
        console.log(event.currentTarget.id);
       if(targetable){
           // event.target.css({"border": "3px solid red"})
               let data = {playerID: event.currentTarget.id, room: localStorage.getItem('current-game-id')};
               console.log('mouse enters box1');
               socket.emit('hover-player', data)
           }
    });

    $gameWindow.on('mouseleave', 'div.box1', event => {
        console.log(event.currentTarget.id);
        if(targetable) {
            let data = {playerID: event.currentTarget.id, room: localStorage.getItem('current-game-id')};
            console.log('mouse leaves box1');
            socket.emit('unhover-player', data)
        }
    });

    $gameWindow.on('click', 'img#card', event => {
        if(myTurn && !drawn) {
            let url = '/PirateParty/draw/' + localStorage.getItem('current-game-id');
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: draw
            })
        } else {
            console.log('Its NOT YOUR TURN FUCK FACE')
        }
    });

    $('.start').on('click' , event => {
        const id = localStorage.getItem('current-game-id');
        hasStarted = true;

        $.ajax({url:'/games/start', type:'post', data: {'gameid' : id}, success: start })
    });

     let $lobbyMessages = $('.messages');


socket.on('connect', ()=> {
    const data= {room: localStorage.getItem('current-game-id'), username: localStorage.getItem('username')};
    connected = true;
    socket.emit('join', data);
});

function start(response){
    console.log('loading pirate party view at gameid:',response.gameID);
    $('#game-window').load('/PirateParty/load-view/'+ response.gameID + ' .container')
}

//-------------------------- Chat --------------------------------------
function sendMessage(msg){
    // let msg = $input.val();
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

    if (hasStarted){
       let $inGameMessages = $('#modal-messages');
       $inGameMessages.append($element);
       $inGameMessages[0].scrollTop = $inGameMessages[0].scrollHeight;

    } else {
        $lobbyMessages.append($element);
        $lobbyMessages[0].scrollTop = $lobbyMessages[0].scrollHeight;
    }
}


//idea taken from socket.io demos
function cleanInput(input) {
    return $('<div/>').text(input).text();
}
});

//-----------------------Game-------------------------------

function draw(clientCard){
    if(clientCard.targetable === true){
        targetable = true;
    }

    drawn = true;

    if(clientCard.type = 'auto') {
        switch (clientCard.name) {
            case 'bomb':
                bomb(clientCard);
                break;
            case 'wenches':
                wenches(clientCard);
                break;
            case 'dudes':
                dudes(clientCard);
                break;
            case 'king':
                king(clientCard);
                break;
            case 'me':
                me(clientCard);
                break;
            case 'bard':
                bard(clientCard);
                break;
            case 'mayhem':
                mayhem(clientCard);
                break;
            default:
                console.log('Targetable');
        }
    }
    currentAction = clientCard
}

function endTurn() {
    $.ajax({
        url: '/PirateParty/' + localStorage.getItem('current-game-id') + '/next-turn',
        type: 'post',
        data: {
            'temp' : 'hello'
        },
        dataType: 'json',
        success:(msg) => {
            console.log(msg);
            targetable = false;
            myTurn = false;

        }
    })
}


// ---------------------------------------------- Targetable ----------------------------------------------
function target(id){
    const url = '/PirateParty/' + localStorage.getItem('current-game-id') + '/target/' + id;
    const type = 'post';
    const dataType = 'json';
    const debugMsg = 'Me client side function called. Data Returned From Server:';
    $.ajax({
        url: url,
        type:'post',
        data: currentAction,
        success: data => {
            console.log(data);
            targetable = false;
            endTurn();
        }
    })
}

// ------------------------------------------ Automatically resolved -------------------------------------------
function bomb(clientCard){
    const url = '/PirateParty/' + localStorage.getItem('current-game-id') + '/bomb';
    const type = 'post';
    const data = clientCard;
    const dataType = 'json';
    const debugMsg = 'Me client side function called. Data Returned From Server:';

    $.ajax({
        url: url,
        type: type,
        data: data,
        dataType: dataType,
        success: data => {
            console.log(debugMsg,data);
            // socket.emit('bomb', data);
            endTurn();
        }
    })
}

function bard(clientCard){
    const url = '/PirateParty/' + localStorage.getItem('current-game-id') + '/bard';
    const type = 'post';
    const data = clientCard;
    const dataType = 'json';
    const debugMsg = 'bard client side';

    $.ajax({
        url: url,
        type: type,
        data: data,
        dataType: dataType,
        success: data => {
            console.log(debugMsg,data);
            // socket.emit('bomb', data);
            endTurn();
        }
    })
}

function mayhem(clientCard){
    const url = '/PirateParty/' + localStorage.getItem('current-game-id') + '/mayhem';
    const type = 'post';
    const data = clientCard;
    const dataType = 'json';
    const debugMsg = 'mayhem client side';

    $.ajax({
        url: url,
        type: type,
        data: data,
        dataType: dataType,
        success: data => {
            console.log(debugMsg,data);
            // socket.emit('bomb', data);
            endTurn();
        }
    })
}


function me(clientCard){
    console.log('inside me function');

    const url = '/PirateParty/' + localStorage.getItem('current-game-id') + '/me';
    const type = 'post';
    const data = clientCard;
    const dataType = 'json';
    const debugMsg = 'Me client side function called. Data Returned From Server:';

    $.ajax({
        url: url,
        type: type,
        data: data,
        dataType: dataType,
        success: data => {
            console.log(debugMsg,data);
            // socket.emit('me', data);
            endTurn();
        }
    })
}

function king(clientCard){
    let url = '/PirateParty/' + localStorage.getItem('current-game-id') + '/king';
    const type = 'post';
    const data = clientCard;
    const dataType = 'json';
    const debugMsg = 'Me client side function called. Data Returned From Server:';

    $.ajax({
        url: url,
        type: type,
        data: data,
        dataType: dataType,
        success: data => {
            console.log(debugMsg,data);
            // socket.emit('king', data);
            endTurn();
        }
    })
}

function wenches(clientCard){
    let url = '/PirateParty/' + localStorage.getItem('current-game-id') + '/wenches';
    const type = 'post';
    const data = clientCard;
    const dataType = 'json';
    const debugMsg = 'Me client side function called. Data Returned From Server:';

    $.ajax({
        url: url,
        type: type,
        data: data,
        dataType: dataType,
        success: data => {
            console.log(debugMsg,data);
            // socket.emit('wenches', data);
            endTurn();
        }
    })
}
function dudes(clientCard){
    let url = '/PirateParty/' + localStorage.getItem('current-game-id') + '/dudes';
    const type = 'post';
    const data = clientCard;
    const dataType = 'json';
    const debugMsg = 'Me client side function called. Data Returned From Server:';

    $.ajax({
        url: url,
        type: type,
        data: data,
        dataType: dataType,
        success: data => {
            console.log(debugMsg,data);
            data.room = localStorage.getItem('current-game-id');
            // socket.emit('dudes', data);
            endTurn();
        }
    })
}
socket.on('take-turn', data => {
    myTurn = true; drawn = false;
   // document.getElementById('gameMsg').innerHTML = data + ', Please Draw a Card';
});

socket.on('card-drawn', data => {
    console.log(data);
    $('.card-container').load('/PirateParty/load-view/'+localStorage.getItem('current-game-id') +' #card');
});

socket.on('on-target', playerID => {
    try {
        console.log('playerID', playerID);
        console.log('playerID.playerID', playerID.playerID);

        let elementName = '#' + playerID;
        $(elementName).css({"border": "3px", "border-style": "solid", "border-color": "red"});
    } catch (error) {
        console.log(error);
    }
});

socket.on('off-target', playerID =>{
    try {
        let elementName = '#' + playerID;
        $(elementName).css({"border": "none"});
    } catch (error) {
        console.log(error);
    }
});

socket.on('player-damaged', data => {
    console.log(data);

    if(data.isArray){
        data.forEach(damagedPlayer => {
            let elementName = '#' + damagedPlayer.playerID;
            $(elementName).css("border", "3px solid red");
            setTimeout(()=>{
                $(elementName).css("border", "none");
            },800)
        })
    } else {
        // let elementName = '#' + playerID;
        // $(elementName).css.toggleClass('.damage-trans');
        let elementName = '#' + data.playerID;
        $(elementName).css("border", "3px solid red");
        setTimeout(()=>{
            $(elementName).css("border", "none");
        },800)
    }
});

socket.on('bomb-animation', data => {
    // setTimeout()
});


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

socket.on('user-left', (data) => {
    $('#players').load(document.URL + ' #players')
});

socket.on('reset-targets', data => {
    console.log(data);
    let elements = document.getElementsByClassName('box1');

    for(let i = 0; i < elements.length; i++){
        elements[i].style.border = "none";
    }
});

socket.on('start-game', (gameID) => {
    $('#game-window').load('/PirateParty/load-view/'+ gameID + ' .container');
    setTimeout(()=>{
        document.getElementById('gameMsg').innerHTML = 'Welcome to Pirate Party !!!';
        setTimeout(()=>{
            document.getElementById('gameMsg').innerHTML = 'Player One!!! Take Your turn !!!';
        },5000)
    },1000);
});











