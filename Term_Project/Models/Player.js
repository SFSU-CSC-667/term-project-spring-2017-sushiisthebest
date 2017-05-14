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

	destroyPlayer: id => {
		const psql = 'DELETE FROM \"Player\" WHERE id = $1';
		return db.none(psql, id);
	},

	create:(userID, gameID, playerCount) => {
		const playerQuery = 'INSERT INTO \"Player\"(userid, gameid, health) VALUES ($1, $2, $3) RETURNING id';
		const incrementPlayerCount = 'UPDATE \"Game\" SET playercount = $1 WHERE id=$2 RETURNING playercount';

		if(playerCount === undefined) { playerCount = 0}

		return db.task( t=> {
			return t.one(playerQuery, [userID, gameID , HEALTH])
				.then(playerID => {
					console.log('Player ID inside new Player.create function', playerID);
					playerCount++;
					return t.one(incrementPlayerCount, [playerCount, gameID])
                })
         })
	},

	// findPlayersInGame: gameID => {
	// 	let query = 'SELECT \"Player.*\", \"User.*\", imagetable.path, \"Avatar\".* FROM \"Player\"'+
	// 				'INNER JOIN \"User\" ON \"Player.userid\"=\"User\".id'+
	// 				'INNER JOIN \"Avatar\" ON (\"Avatar\".id = \"User\".avatarid)'+
	// 				'INNER JOIN imagetable ON (imagetable.id = \"Avatar\".imageid)'+
	// 				'WHERE \"Player\".gameid = $1';
    //
	// 	return db.any(query, gameid)
    //
	// }
};
