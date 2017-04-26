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

	create:() => {
		return db.none({
			name:'create-user',
			text: 'INSERT INTO \"User\"(id, ruletext, name) VALUES ($1, $2, $3)',
			values: [id,ruletext, name, 1]
			})
		.then(new_card_id => {
			console.log('new card created with id:', new_card_id);
			return new_user_id;
		})

	}


};

	module.exports = Cards;