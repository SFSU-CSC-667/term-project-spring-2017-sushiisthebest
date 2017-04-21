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

}

if(token)
