const HEALTH =  100;

var db = require('../config/database');

module.exports = {
	findPlayerByUserID: userID =>{
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

	destroyPlayer: (userID, gameID) => {
		const query = 'DELETE FROM \"Player\" WHERE userid = $1';
		const updatePlayerCount = 'UPDATE \"Game\" SET playercount = playercount - 1 WHERE id = $1';

		return db.tx(t => {
			return t.batch([
				t.none(query, userID),
				t.none(updatePlayerCount, gameID)
			])
		});
	},

	create:(userID, gameID, playerCount) => {
		const playerQuery = 'INSERT INTO \"Player\"(userid, gameid, health) VALUES ($1, $2, $3) RETURNING id';
		const incrementPlayerCount = 'UPDATE \"Game\" SET playercount = $1 WHERE id=$2';

		if(playerCount === undefined) { playerCount = 0}

		return db.task( t=> {
			return t.one(playerQuery, [userID, gameID , HEALTH])
				.then(player => {
					console.log('Player ID inside new Player.create function', player.id);
					playerCount++;
					return t.none(incrementPlayerCount, [playerCount, gameID])
                })
         })
	},
};
