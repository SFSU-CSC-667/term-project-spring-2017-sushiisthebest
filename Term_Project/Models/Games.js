
var connection = {
  host: "localhost",
  port: 5432,
  database: "csc667",
  user: 'postgres',
  password: "6848broken"
};

var pgp =  require('pg-promise')();
var db = pgp(connection);


module.exports = {
	findGameByID: id =>{
		return db.oneOrNone({
      name: 'find-game-by-id'
      text: 'SELECT * FROM \"Game\" WHERE ID = $1' ,
      values: [id]
    })
	},

	findGameByName: name =>{
		return db.oneOrNone({
			name:'find-game-by-name',
			text: 'SELECT * FROM \"Games\" WHERE name = $1',
			values: [name]
		})
	},

	create:(id, name, hashstarted, playerturnid, currentcard, minigameturn) => {
		return db.none({
			name:'create-game',
			text: 'INSERT INTO \"Games\"(id, name, hashstarted, playerturnid, currentcard, minigameturn) VALUES ($1, $2, $3, $4, $5, $6)',
			values: [id,name,hashstarted, playerturnid, minigameturn, 1]
			})
		.then(new_game_id => {
			console.log('new game created with id:', new_game_id);
			return new_game_id;
		})

	}


};
