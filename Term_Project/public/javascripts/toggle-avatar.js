$(function() {
    //TODO CHANGE HARD CODED VALUES TO CONSTANTS
    $('#previousAvatar').on("click", previousAvatar);
    $('#nextAvatar').on("click", nextAvatar);
});



    function previousAvatar(){
        var avatarID = $('#avatar').data('avatarid');
        console.log('CLIENT SIDE avatarID:', avatarID);

        avatarID === 1 ? avatarID = 4 : avatarID--;


        $.ajax({
            url: $(location).attr('href') + '/changeAvatar',
            type: 'post',
            data: {
                'avatarID': avatarID
            },
            dataType: 'json',

            success: (avatar) => {
                $('#avatar').attr('src', avatar.path);
                $('#avatarName').html(avatar.name);
                $('#avatar').data('avatarid', avatar.id);
            }
        })
    }

    function nextAvatar(){
        var avatarID = $('#avatar').data('avatarid');

        avatarID === 4 ? avatarID = 1 : avatarID++;


        $.ajax({
            url: $(location).attr('href') + '/changeAvatar',
            type: 'post',
            data: {
                'avatarID': avatarID
            },
            dataType: 'json',

            success: (avatar) => {
                $('#avatar').attr('src', avatar.path);
                $('#avatarName').html(avatar.name);
                $('#avatar').data('avatarid', avatar.id);
            }
        })
    }
