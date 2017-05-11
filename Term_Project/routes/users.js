const express = require('express');
const app = require('../app');
const router = express.Router();
const debug = true;
const bcrypt = require('bcrypt');
const User = require('../Models/User');
const passport = require('passport');
const jwt = require('jwt-simple');



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

		const data = {username: user.username, path: '/users'};
		res.status(200).json(data);

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
			res.redirect('login');
		})
		.catch(error=>{
			console.log(error);
		})
	})
});

//TODO FIGURE OUT WHY /USERS/GAMES/ <<< route does not send a 401 response
router.get('/:username', passport.authenticate('jwt', {session: false}),  function(req,res,next){
	let profile = {};
	profile.username= req.user.username;

	User.getUserProfileById(req.user.id)
		.then(avatar=>{
			//builds profile object for rendering
			profile.avatarID = avatar.id;
			profile.avatarName = avatar.name;
			profile.avatarImgPath = avatar.path;

			console.log('profile object:',profile);
			res.render('profile', profile);
		})
		.catch(error => console.log(error));

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

module.exports = router;
