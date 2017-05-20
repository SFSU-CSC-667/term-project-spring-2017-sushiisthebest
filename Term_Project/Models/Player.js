const HEALTH =  100;
const db = require('../config/database');

module.exports = {
	findPlayerByUserID: userID =>{
		return db.oneOrNone({
      name: 'find-game-by-id',
      text: 'SELECT * FROM \"Player\" WHERE ID = $1' ,
      values: [id]
		})
	},

	findPlayersByGame: gameID => {
		const query = 'SELECT * FROM \"Player\" WHERE gameid = $!';

		return db.any = (query, gameID);
	},


	findPlayerByName: username =>{
		return db.oneOrNone({
			name:'find-player-by-name',
			text: 'SELECT * FROM \"Player\" WHERE name = $1',
			values: [username]
		})
	},

	damagePlayer: (id, damage) => {
		let query = "UPDATE \"Player\" SET health=health - $1 WHERE id = $2 RETURNING health, id";
		return db.one(query, [damage, id])
	},

	damagePlayers: (players, damage) => {
		let queries = [];
		return db.task(t=> {
            players.forEach(player => {
                queries.push(this.damagePlayer(player.id,damage));
            });
            return t.batch(queries);
        })
	},

	//TODO TO BE REPLACed eVentuALLY done with time in mind
	damagePlayerByName: (username,damage) => {
		const query = 'UPDATE \"Player\" SET health=health - $1 FROM \"Player\" ' +
			'INNER JOIN \"User\" ON \"Player\".userid = \"User\".id WHERE \"User\".username = $2 RETURNING health, \"Player\".id' ;

		return db.none(query,[damage,username]);
	},

	healerPlayerById: (id, heal) => {
        let query = "UPDATE \"Player\" SET health=health + $1 WHERE id = $2 RETURNING health";
        return db.one(query, [damage, id])
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
		const playerQuery = 'INSERT INTO \"Player\"(userid, gameid, health, turnorder) VALUES ($1, $2, $3, $4) RETURNING id';
		const incrementPlayerCount = 'UPDATE \"Game\" SET playercount = $1 WHERE id=$2';

		if(playerCount === undefined) { playerCount = 0;}
		let turnOrder = playerCount + 1;

		return db.task( t=> {
			return t.one(playerQuery, [userID, gameID , HEALTH, turnOrder])
				.then(player => {
					console.log('Player ID inside new Player.create function', player.id);
					playerCount++;
					return t.none(incrementPlayerCount, [playerCount, gameID])
                })
         })
	},
};
