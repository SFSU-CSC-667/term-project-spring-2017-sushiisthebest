/**
 * Created by euphoric on 5/7/17.
 */

$(function(){
   $('#create').submit(event => {
       event.preventDefault();

       $.ajax({
           url: "/games/create",
           type: 'post',
           data: {
               'game_name': $('#game-name').val(),
               'game_description': $('#game-description').val()
           },
           dataType: 'json',
           success: createGame
       })
   })
});

function createGame(response) {
    console.log(response);

    localStorage.setItem('current-game-id', response.currentGameId);
    localStorage.setItem('current-player-id', response.currentPlayerId);

    window.location = response.path;
}