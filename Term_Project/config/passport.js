var User = require('../Models/User');
var LocalStrategy = require('passport-local');
var bcrypt = require('bcrypt');


var passport_config = function(passport){
	/* NO LONGER USING SESSIONS CODE IS HERE FOR REFERENCE. TO BE REMOVED
	passport.serializeUser(function(user,done) {
		done(null,user.id);
	});

	passport.deserializeUser(function(id,done){
		//TODO look up id in database
		User.findUserById(id)
		.then((user)=>{
			done(null,user);
		})
		.catch(error => {
			done(error, null);
		})
	});
	*/

	passport.use('local', new LocalStrategy({
		usernameFeild: 'email',
		passwordField: 'password',
		session: false
},function(email,password,done){
	console.log('searching for user:',email, 'password:',password);
	User.findUserByEmail(email)
	.then( user => {
		if(!user) {
			console.log('user not found');
			return done(null,false);
		}
		
		var passMatches = bcrypt.compareSync(password,user.password);

		if (!passMatches) {
			console.log('password does not match');
			return done(null,false);
		}

		console.log('success');
		return done(null, user);
		
	})
	.catch(error=>{
		console.log(error);
		return done(error);
	})
}))

	
}

module.exports = passport_config;