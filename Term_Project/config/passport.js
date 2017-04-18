var User = require('../model/User');


var passport_config = function(passport){
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

	passport.use('local' new LocalStrategy({
		usernameFeild: 'email',
		passwordField: 'password'
},function(email,password,done){
	User.findUserByEmail(email)
	.then( user => {
		if(!user) {return done(null,false);}
		
		var passMatches = bcrypt.compareSync(password,user[0].password);

		if (!passMatches) { return done(null,false);}

		return done(null, user[0]);
		
	})
	.catch(error=>{
		return done(error);
	})
}))

	
}