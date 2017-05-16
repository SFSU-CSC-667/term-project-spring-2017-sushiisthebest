	const db = require('../config/database');


module.exports = {
	findCardByID: id =>{
		return db.oneOrNone({
			  name: 'find-card-by-id',
			  text: 'SELECT * FROM \"Card\" WHERE ID = $1' ,
			  values: [id]
    	})
	},

	findCardByName: name =>{
		return db.oneOrNone({
			name:'find-card-by-name',
			text: 'SELECT * FROM \"Card\" WHERE name = $1',
			values: [name]
		})
	},

	findSushiCards: () =>{
		return db.many({
			name:'find-sushi-cards',
			text: 'SELECT \"Card\".*, imagetable.path FROM \"Card\" ' +
			'INNER JOIN imagetable ON (imagetable.id = \"Card\".imageid) ' +
			'WHERE \"Card\".id > 0 AND \"Card\".id < 5',
			values: []
		})
	},

	findRuleCards: () =>{
		return db.many({
			name:'find-rule-cards',
			text: 'SELECT \"Card\".*, imagetable.path FROM \"Card\" ' +
			'INNER JOIN imagetable ON (imagetable.id = \"Card\".imageid) ' +
			'WHERE \"Card\".id > 4 AND \"Card\".id < 9',
			values: []
		})
	},

	getPlayingCards: () =>{
		return db.many({
			name: 'get-playing-cards',
			text: 'SELECT \"Card\".* FROM \"Card\" WHERE \"Card\".gamecard = true',
			values:[]
		})
	},

	create:(card) => {
		let query = 'INSERT INTO \"Card\" (face, suit, value) values($1, $2, $3)';
		return db.none(query,card);

	}
};

