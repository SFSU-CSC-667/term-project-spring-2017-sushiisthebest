
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
	findPlayerByID: id =>{
		return db.oneOrNone({
      name: 'find-game-by-id'
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

	create:(id, userid, gameid, isturn, health, lastcard) => {
		return db.none({
			name:'create-player',
			text: 'INSERT INTO \"Player\"(id, userid, gameid, isturn, health, lastcard) VALUES ($1, $2, $3, $4, $5, $6)',
			values: [id,userid,gameid,isturn,health,lastcard, 1]
			})
		.then(new_player_id => {
			console.log('new player created with id:', new_player_id);
			return new_player_id;
		})

	}


};
