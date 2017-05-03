
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

	getLobby: id => {
		let gameQuery = 'SELECT name, playercount FROM \"Game\" WHERE id = S1';
        let playerQuery = 'SELECT \"Game\".id, \"Player\".*, \"User\".*, imagetable.path, \"Avatar\".* FROM \"Player\"'+
            'INNER JOIN \"User\" ON \"Player.userid\"=\"User\".id'+
            'INNER JOIN \"Avatar\" ON (\"Avatar\".id = \"User\".avatarid)'+
            'INNER JOIN imagetable ON (imagetable.id = \"Avatar\".imageid)'+
            'WHERE \"Player\".gameid = $1';

		return db.task(t => {
			return t.batch([
				t.one(gameQuery, id),
				t.any(playerQuery, id)
			])
		});
	}



};
