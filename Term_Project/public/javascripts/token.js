
    var debug = true;
    //const socket = io();


    $('#login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: '/users/login',
            data: $('#login').serialize(),
            success: storeJwt,
            dataType: 'json'
        });
    });

    function storeJwt(token) {

        debug ? console.log('data:', token) : null;
        //localStorage.setItem('access_token', token.token);
        document.cookie = token.token;

        window.location.replace('http://localhost:3000/users');

        //TODO CHANGE THIS TO DEPLOYED PATH
        // $.get('http://localhost:3000/users', function(){
        //     console.log('success');
        // });
    }


//     if (window.localStorage.getItem('access_token')) {
//         $.ajaxSetup({
//             headers: {'Authorization': 'Bearer ' + window.localStorage.getItem('access_token')}
//         })
//     }
//
// //
// // let socket = io.connect('http://localhost:3000/');
// // socket.on('connect', (data) => {
//
//     socket.on('send-token', (data) => {
//         socket.emit('auth', localStorage.getItem('access_token'));
//     });
// });
