/**
 * Created by euphoric on 5/6/17.
 */

$(function(){
    $('#login').submit(event => {
        event.preventDefault();

        $.ajax({
            url: "/users/login",
            type: 'post',
            data: {
                'username': $('#username').val(),
                'password': $('#password').val(),
            },
            dataType: 'json',
            success: data => {
                localStorage.setItem('username', data.username);
                console.log(localStorage.getItem('username'));
                window.location = data.path;
            }

        })
    })
});