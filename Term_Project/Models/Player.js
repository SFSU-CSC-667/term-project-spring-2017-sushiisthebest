

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
		return db.none({
			name:'create-player',
			text: 'INSERT INTO \"Player\"(userid, gameid) VALUES ($1, $2)',
			values: [userID, gameID]
			})
		.then(new_player_id => {
			console.log('new player created with id:', new_player_id);
			return new_player_id;
		})

	}


};
