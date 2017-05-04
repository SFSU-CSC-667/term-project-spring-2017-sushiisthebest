
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
	//TODO move big shit to sql query files. because they are fucking annoying
	getLobby: id => {
		let query = 'SELECT \"Game\".name AS gamename, \"Game\".id AS gameid, \"Game\".description AS gameinfo, \"Player\".*, \"User\".username , imagetable.path AS imageurl FROM \"Game\"'
		+			'INNER JOIN \"Player\" ON \"Game\".id \"Player\".gameid'
		+			'INNER JOIN \"User\" ON \"Player\".id = \"User\".id'
		+			'INNER JOIN \"Avatar\" ON \"User\".avatarid = \"Avatar\".id'
		+			'INNER JOIN  imagetable on imagetable.id = \"Avatar\".id'
		+			'WHERE \"Game\".id = $1';

		return db.any(query,id);


    }



};
