/**
 * Created by euphoric on 5/14/17.
 */
$(function () {
    $(".btnleave").on('click', (event)=>{
        const gameid = localStorage.getItem('current-game-id');

        $.ajax({
            url: window.location.origin +'/games/leave',
            type: 'post',
            data: {
                'gameid' : gameid,
            },
            dataType: 'json',
            success: leave
        })
    })
});

//TODO IMPLeMENT WAY TO COMMUNICATE to the USER < not the console when the game is full or has already started
function leave (response){
    console.log(response);
    localStorage.clear();

    window.location = window.location.origin + response.path;
}
