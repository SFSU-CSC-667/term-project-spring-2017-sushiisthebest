$(function() {

    function previousAvatar(){
        var avatar_id = $.fromUrlQueryParameter('avatar_id');

        $.ajax({
            url: '/users?avatar_id='+ avatar_id,
            type: 'get',
            dataType: 'json',

            success: (data) => {
                $('#avatar').attr('src', data.path);
            }
        })
    }

    // function nextAvatar(){
    //         url: '/users?avatar_id='
    //         type: 'get',
    //     })
    // }


})();