$(function() {
    //TODO CHANGE HARD CODED VALUES TO CONSTANTS
    $('.rulecardimg').on("click", changeRuleCard);

});

function changeRuleCard(event){
    console.log(event);
    let id = parseInt(event.target.id);

    console.log('CLIENT SIDE ruleCardID:', id);

    $.ajax({
        url: $(location).attr('href') + '/changeRuleCard',
        type: 'post',
        data: {
            'ruleCardID': id
        },
        dataType: 'json',

        success: (ruleCard) => {
            $('#rulecardtext').html(ruleCard.ruletext);
        }
    })
}