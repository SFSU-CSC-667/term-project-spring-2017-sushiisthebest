const HEALTH =  100;

var db = require('../config/database');

module.exports = {
	findPlayerByID: id =>{
		return db.oneOrNone({
      name: 'find-game-by-id',
      text: 'SELECT * FROM \"Player\" WHERE ID = $1' ,
      values: [id]
		})
	},

	findPlayerByName: name =>{
		return db.oneOrNone({
			name:'find-player-by-name',
			text: 'SELECT * FROM \"Player\" WHERE name = $1',
			values: [name]
		})
	},

	create:(userID, gameID) => {
		return db.one({
			name:'create-player',
			text: 'INSERT INTO \"Player\"(userid, gameid, health) VALUES ($1, $2, $3) RETURNING id',
			values: [userID, gameID, HEALTH]
			})
	},

	findPlayersInGame: gameID => {
		let query = 'SELECT \"Player.*\", \"User.*\", imagetable.path, \"Avatar\".* FROM \"Player\"'+
					'INNER JOIN \"User\" ON \"Player.userid\"=\"User\".id'+
					'INNER JOIN \"Avatar\" ON (\"Avatar\".id = \"User\".avatarid)'+
					'INNER JOIN imagetable ON (imagetable.id = \"Avatar\".imageid)'+
					'WHERE \"Player\".gameid = $1';

		return db.any(query, gameid)

	}


};
