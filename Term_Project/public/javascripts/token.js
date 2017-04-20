$('#login').submit(function(e) {
	e.preventDefault();
	$.post('users/login', { username: $(#username).val(), password: $(#password)})
	.done(function(response){
		if(response.token) {
			$window.sessionStorage.accessToken = response.token;
			console.log("Success!!! token=",response.token);
		} else { console.log("token not found");}
	})
	}, 'json');