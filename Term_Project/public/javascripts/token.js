var token;

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

function storeJwt(data){
	console.log('bleh');
	console.log('data:', data);
	localStorage.setItem('access_token',data.token);
	console.log("data.token:", data.token);
    let socket = io.connect('http://localhost:4200');
    socket.on('connect', (data) => {
        socket.emit('send-token', localStorage.getItem('access_token'));
    });

};


