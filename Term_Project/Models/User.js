
var db = require('../config/database');
//var Image = require('../ImageTable');
//var Avatar = require('../Avatar');


module.exports = {
	findUserByEmail: email =>{
		return db.oneOrNone('SELECT * FROM \"User\" WHERE email = $1' , email);
	},

	findUserById: id =>{
		return db.oneOrNone({
			name:'find-user-by-id',
			text: 'SELECT * FROM \"User\" WHERE id = $1',
			values: [id]
		})
	},

    getUserProfileById: id => {

	    //var profile = {};

        var initialQuery = 'SELECT * FROM \"User\" WHERE id = $1';
        var avatarQuery = 'SELECT \"Avatar\".name, \"Avatar\".id, imagetable.path FROM \"Avatar\"'+
            ' INNER JOIN imagetable ON (\"Avatar\".imageid = imagetable.id) WHERE \"Avatar\".id = $1';


        return db.task( t => {
            return t.one(initialQuery, id)
                .then(user => {
                    console.log('user', user);

                    //profile.username = user.username;
                    //profile.avatarID = user.avatarid;

                    return t.one(avatarQuery, user.avatarid);
                });
        })


     },



	create: (email,username,password_hash) => {
		/* This is an example of a prepared statement in
		using pg-promise. This helps  prevent sql injections and
		makes the eclaration rather explicit. we should probably use this methodu
		*/

		return db.none({
			name:'create-user',
			text: 'INSERT INTO \"User\"(email, username, password, userstatsid) VALUES ($1, $2, $3, $4)',
			values: [email,username,password_hash, 1]
			})
		/*
		.then(new_user_id => {
			console.log('new user created with id:', new_user_id);
			return new_user_id;
		})
		*/
	},

	changeAvatar: (userID, avatarID) => {

	    var initialQuery = 'UPDATE \"User\" SET avatarid=$1 WHERE id=$2';
	    var secondQuery = 'SELECT \"Avatar\".name, \"Avatar\".id, imagetable.path FROM \"Avatar\"'+
        ' INNER JOIN imagetable ON (\"Avatar\".imageid = imagetable.id) WHERE \"Avatar\".id = $1';

		return db.task( t => {
            console.log('inside task');
		    return t.batch([
		        t.none(initialQuery, [avatarID,userID]),
                t.one(secondQuery,avatarID)
            ]);
        })

	},



	
};


