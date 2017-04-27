$(function() {
    var avatar_id = $.fromUrlQueryParameter('avatar_id');

    function previousAvatar(){

        $.ajax({
            url: '/users?avatar_id='+ (avatar_id - 1 < 1 ? avatar_id = 4 : avatar_id -= 10),
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