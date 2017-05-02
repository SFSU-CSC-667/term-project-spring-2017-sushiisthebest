
var db = require('../config/database');

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

	create:(name, playerid) => {
		return db.none({
			name:'create-game',
			text: 'INSERT INTO \"Game\"(name, hasstarted, playercount, playerturnid) VALUES ($1, $2, $3, $4 )',
			values: [id,name, false, 1, playerid]
			})
	}
};
