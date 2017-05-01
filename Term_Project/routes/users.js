var express = require('express');
var app = require('../app');
var router = express.Router();
var debug = true;
var bcrypt = require('bcrypt');
var User = require('../Models/User');
var passport = require('passport');
var jwt = require('jwt-simple');



require('../config/passport.js')(passport);



router.get('/', passport.authenticate('jwt', {session: false}), function(req,res,next) {
    next();

},  function(req,res,next){

	if(req.user){
		res.redirect('/users/' + req.user.username);
	} else {
		debug ? console.log("not logged in ???") : null;
	}
});

router.get('/login',function(req,res,next){
	res.render('login');
});

router.post('/login', function(req, res, next){
	passport.authenticate('local', function(error,user, info){

		if (error) { return next(err) }

		if (!user) {
		  return res.json(401, { error: 'some fucked up shizz' });
		}

		let token = jwt.encode({id: user.id, username: user.username, email: user.email}, "secret");
		let opts = {maxAge:9000000};
		res.cookie('jwt', token, opts);

		res.redirect('/users');

})(req, res, next);
});

router.get('/register',function(req, res, next){
	res.render('register');
});

router.post('/register', function(req, res, next){
    User.findUserByEmail(req.body.email)
	.then(user=>{

		if(!user){
			console.log('Sucess: user does not already exist');
			next();
		} else {
			console.log('email already in use');
		}
	})
}, function(req, res, next){
	
	bcrypt.hash(req.body.password, 10)
	.then(hash =>{
		debug ? console.log("Hash: ", hash): null;
		debug ? console.log("Attempting to store email:", req.body.email, "username:",req.body.username, "password_hash:", hash) : null;
		
		User.create(req.body.email, req.body.username, hash)
		.then(()=>{
			res.redirect('/login');
		})
		.catch(error=>{
			console.log(error);
		})
	})
});

router.get('/:username', passport.authenticate('jwt', {session: false}),  function(req,res,next){
	var profile = {};
	profile.username= req.user.username;
	// let promise = new Promise((resolve, reject) => {
     //    let profile = User.getUserProfileById(req.user.id);
     //    console.log('profile object inside promise:', profile);
	// 	resolve(profile);
	// });
    //
	// promise.then((profile) => {
	// 	console.log('profile:', profile);
	// 	res.render('profile', profile);
	// });

	User.getUserProfileById(req.user.id)
		.then(avatar=>{
			profile.avatarID = avatar.id;
			profile.avatarName = avatar.name;
			profile.avatarImgPath = avatar.path;

			console.log('profile object:',profile);
			res.render('profile', profile);
		})

});

router.post('/:username/changeAvatar', passport.authenticate('jwt',{session:false}) , (req, res, next) => {
	console.log('---ENTERING /:username/changeAvatar Route---');
	console.log('userID FROM COOKIE', req.user.id);
	console.log('avatarID from BODY', req.body.avatarID);

	User.changeAvatar(req.user.id, req.body.avatarID)
		.then(avatar => {
			console.log('avatar', avatar[1]);
			res.json(avatar[1]);
		})
		.catch(error => {
			console.log(error);
		})


});

//TODO THIS IS AN EXAMPLE NEEDS TO BE FINISHED

router.get('/:username/')

module.exports = router;
