const socket = io();


$('#login').submit(function(e) {
	e.preventDefault();
	$.ajax({
        type: "POST",
        url: '/users/login',
        data: $('#login').serialize(),
        success: storeJwt,
        dataType: 'json'
    });
});

function storeJwt(token){
	console.log('bleh');
	console.log('data:', token);
	localStorage.setItem('access_token',token.token);
	console.log("data.token:", token.token);
    let socket = io.connect('http://localhost:3000/');
    socket.on('connect', (data) => {

        socket.on('send-token', (data) => {
            socket.emit('auth', localStorage.getItem('access_token'));
        });
    });

}

if(window.localStorage.getItem('access_token')){
    $.ajaxSetup({
        headers: {'Authorization': 'Bearer ' + window.localStorage.getItem('access_token')}
    })
}

