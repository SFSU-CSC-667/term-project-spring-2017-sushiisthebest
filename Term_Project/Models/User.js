const DEFAULT_AVATAR = 1;
const db = require('../config/database');


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
        const initialQuery = 'SELECT * FROM \"User\" WHERE id = $1';
        const avatarQuery = 'SELECT \"Avatar\".name, \"Avatar\".id, imagetable.path FROM \"Avatar\"'+
            ' INNER JOIN imagetable ON (\"Avatar\".imageid = imagetable.id) WHERE \"Avatar\".id = $1';


        return db.task( t => {
            return t.one(initialQuery, id)
                .then(user => {
                    console.log('user', user);
                    return t.one(avatarQuery, user.avatarid);
                });
        })


     },



	create: (email,username,password_hash) => {
		return db.none({
			name:'create-user',
			text: 'INSERT INTO \"User\"(email, username, password, avatarid) VALUES ($1, $2, $3, $4)',
			values: [email,username,password_hash, DEFAULT_AVATAR]
			})
	},

	changeAvatar: (userID, avatarID) => {

	    const initialQuery = 'UPDATE \"User\" SET avatarid=$1 WHERE id=$2';
	    const secondQuery = 'SELECT \"Avatar\".name, \"Avatar\".id, imagetable.path FROM \"Avatar\"'+
        ' INNER JOIN imagetable ON (\"Avatar\".imageid = imagetable.id) WHERE \"Avatar\".id = $1';

		return db.task( t => {
            console.log('inside task');
		    return t.batch([
		        t.none(initialQuery, [avatarID,userID]),
                t.one(secondQuery,avatarID)
            ]);
        })
	},

    changeRuleCard: (userID, ruleCardID) => {

        var initialQuery = 'UPDATE \"User\" SET rulescardid=$1 WHERE id=$2';
        var secondQuery = 'SELECT \"Card\".ruletext FROM \"Card\" WHERE \"Card\".id = $1';

        return db.task( t => {
            console.log('inside task');
            return t.batch([
                t.none(initialQuery, [ruleCardID,userID]),
                t.one(secondQuery,ruleCardID)
            ]);
        })

    },

    changeSushiCard: (userID, ruleCardID) => {

        var initialQuery = 'UPDATE \"User\" SET sushicardid=$1 WHERE id=$2';
        var secondQuery = 'SELECT \"Card\".ruletext FROM \"Card\" WHERE \"Card\".id = $1';

        return db.task( t => {
            console.log('inside task');
            return t.batch([
                t.none(initialQuery, [ruleCardID,userID]),
                t.one(secondQuery,ruleCardID)
            ]);
        })
    },
};


