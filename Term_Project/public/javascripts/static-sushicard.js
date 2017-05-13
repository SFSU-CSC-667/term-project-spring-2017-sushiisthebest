$(function() {
    //TODO CHANGE HARD CODED VALUES TO CONSTANTS
    $('.sushicardimg').on("click", changeSushiCard);

});

function changeSushiCard(event){
    console.log(event);
    let id = parseInt(event.target.id);

    console.log('CLIENT SIDE sushiCardID:', id);

    $.ajax({
        url: $(location).attr('href') + '/changeSushiCard',
        type: 'post',
        data: {
            'sushiCardID': id
        },
        dataType: 'json',

        success: (sushiCard) => {
            $('#sushiruletext').html(sushiCard.ruletext);
        }
    })
};