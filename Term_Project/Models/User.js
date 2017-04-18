
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
	getUser: email =>{
		db.oneOrNone('SELECT * FROM User WHERE email = $1' , email)
		.then(user => {
			return user;
		})
		.catch(error => {
			console.log(error);
		})
	},
	create:(email,username,password_hash) => {
		/* This is an example of a prepared statement in
		using pg-promise. This helps  prevent sql injections and
		makes the declaration rather explicit. we should probably use this method 
		*/
		db.one({
			name:'create-user',
			text: 'INSERT into Users(email, username, password) VALUES ($1,$2,$3) RETURNING id',
			values: arguments
			})
		/*
		.then(new_user_id => {
			console.log('new user created with id:', new_user_id);
			return new_user_id;
		})
		*/
	}
};


