
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
	findUserByEmail: email =>{
		return db.oneOrNone('SELECT * FROM \"User\" WHERE email = $1' , email);
	},

	findUserById: id =>{
		return db.oneOrNone({
			name:'find-user-by-id',
			text: 'SELECT * FROM \"User\" WHERE id = $1',
			values: [id]
		})
	},

	create:(email,username,password_hash) => {
		/* This is an example of a prepared statement in
		using pg-promise. This helps  prevent sql injections and
		makes the eclaration rather explicit. we should probably use this method 
		*/

		return db.none({
			name:'create-user',
			text: 'INSERT INTO \"User\"(email, username, password, userstatsid) VALUES ($1, $2, $3, $4)',
			values: [email,username,password_hash, 1]
			})
		/*
		.then(new_user_id => {
			console.log('new user created with id:', new_user_id);
			return new_user_id;
		})
		*/
	}

	
};


