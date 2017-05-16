/**
 * Created by euphoric on 5/12/17.
 */

$(function() {
    console.log('hello');
    let $gameWindow = $('div#game-window');

    $gameWindow.on('click', 'img#modal-btn', event => {
        console.log(event.target);
        console.log('something is bad');
        document.getElementById('chat-modal').style.display = "block";
    });

    $gameWindow.on('click', 'span.close', event => {
        document.getElementById('chat-modal').style.display = "none";
    });
});