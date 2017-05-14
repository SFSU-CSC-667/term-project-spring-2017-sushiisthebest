//
// var connection = {
//   host: "localhost",
//   port: 5432,
//   database: "csc667",
//   user: 'postgres',
//   password: "6848broken"
// };
//
// var pgp =  require('pg-promise')();
// var db = pgp(connection);


var db = require('../config/database');



	var Cards = {
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
			text: 'SELECT \"Card\".* FROM \"Card\" WHERE \"Card\".id > 8',
			values:[]
		})
	},

	create:() => {
		return db.none({
			name:'create-user',
			text: 'INSERT INTO \"User\"(id, ruletext, name, imageid) VALUES ($1, $2, $3, $4)',
			values: [id,ruletext, name, imageid]
			})
		.then(new_card_id => {
			console.log('new card created with id:', new_card_id);
			return new_user_id;
		})

	}


};

	module.exports = Cards;