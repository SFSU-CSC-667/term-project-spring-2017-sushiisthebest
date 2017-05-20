/**
 * Created by euphoric on 5/5/17.
 */
$(function () {
    $(".btnjoin").on('click', (event)=>{

        //console.log(event.target.id);
        let id = parseInt(event.currentTarget.id);
        console.log(id);
        $.ajax({
            url: window.location.href +'/join',
            type: 'post',
            data: {'gameid' : id},
            dataType: 'json',
            success: join
        })
    })
});


//TODO IMPLeMENT WAY TO COMMUNICATE to the USER < not the console when the game is full or has already started
function join (response){
    if(response.msg !== 'success') { console.log(response.msg); location.reload(true) }
    localStorage.setItem('current-game-id', response.currentGameId);

    window.location = window.location + response.path;
}




