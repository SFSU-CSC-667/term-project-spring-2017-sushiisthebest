/**
 * Created by euphoric on 5/2/17.
 */
$(function () {
    $('.start').on('click' , event => {
        const id = localStorage.getItem('current-game-id');
        console.log('testing is local storage is available',id);
        hasStarted = true;
        $('#game-window').load('/PirateParty .container');

        // $.get('/PirateParty', (result) => {
        //     console.log(result);
        // })
    })
});

