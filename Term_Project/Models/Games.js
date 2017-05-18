const db = require('../config/database');
const User = require('../Models/User');
const Player = require('../Models/Player');

module.exports = {
	findGameByID: id =>{
		return db.oneOrNone({
      name: 'find-game-by-id',
      text: 'SELECT * FROM \"Game\" WHERE id = $1' ,
      values: [id]
    	})
	},

	findGameByName: name =>{
		return db.oneOrNone({
			name:'find-game-by-name',
			text: 'SELECT * FROM \"Game\" WHERE name = $1',
			values: [name]
		})
	},


	updatePlayerTurnID: (gameID, playerid) => {
		let query = 'UPDATE \"Game\" SET playerturnid = $1 WHERE id = $2'
		return db.none(query, [playerid, gameID])
	},

	getCurrentTurn: gameID => {
		const query =  'select \"Game\".playerturnid, \"Game\".playercount, \"Player\".turnorder FROM \"Game\" INNER JOIN ' +
			' \"Player\" ON  \"Game\".playerturnid = \"Player\".id WHERE \"Game\".id = $1';

        return db.one(query, gameID)
	},

	hasStarted: gameID => {
		const query = 'SELECT hasstarted FROM \"Game\" WHERE id = $1';
		return db.one(query,gameID)
	},
	// destroyGame: gameID => {
	//     // this function deletes game and all players tied to game
     //    // to be used when game ends or HOST leaves the game before it has started
     //    const gameQuery = 'SELECT'
	// 	return
    //
	// },

	startGame: gameID => {
		console.log("gameID in model:",gameID);
		const playerQuery = 'SELECT id FROM \"Player\" WHERE gameid = $1 AND turnorder = 1';
		const query = "UPDATE \"Game\" SET hasstarted=true, playerturnid=$1 WHERE id= $2";
		return db.task(t=> {
			return t.one(playerQuery, gameID)
				.then(player => {
					console.log('Settings playerturnid to:', player.id);
					return t.none(query,[player.id, gameID])
				})
		})
	},

	getVisibleGames: () => {
		return db.manyOrNone({
			name:'get-visible-games',
			text:'SELECT id, name, hasstarted, playercount FROM \"Game\" WHERE hasstarted = false AND playercount != 5',
            values: undefined
		})
	},

	create:(name, description) => {
		return db.one({
			name:'create-game',
			text: 'INSERT INTO \"Game\"(name, hasstarted, playercount, description) VALUES ($1, $2, $3, $4) RETURNING id',
			values: [name, false, 1, description]
			})
	},
	//TODO move big shit to sql query files. because they are fucking annoying
	getLobby: id=> {
		let query = 'SELECT \"Game\".name AS gamename, \"Game\".id AS gameid, \"Game\".description AS gameinfo, \"Game\".currentcard, \"Player\".*, \"User\".username , imagetable.path AS imageurl FROM \"Game\"'
		+			'INNER JOIN \"Player\" ON (\"Game\".id = \"Player\".gameid)'
		+			'INNER JOIN \"User\" ON (\"Player\".userid = \"User\".id)'
		+			'INNER JOIN \"Avatar\" ON (\"User\".avatarid = \"Avatar\".id)'
		+			'INNER JOIN  imagetable ON (imagetable.id = \"Avatar\".imageid)'
		+			'WHERE \"Game\".id = $1';

		return db.any(query,id);
    }
};
