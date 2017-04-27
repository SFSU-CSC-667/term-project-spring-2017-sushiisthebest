var express = require('express');
var app = require('../app');
var router = express.Router();
var debug = true;
var bcrypt = require('bcrypt');
var User = require('../Models/User');
var passport = require('passport');
var jwt = require('jwt-simple');


//var io = app.get('io');




require('../config/passport.js')(passport);


/* GET users listing. */

router.get('/', passport.authenticate('jwt', {session: false}), function(req,res,next) {
	console.log('hiya');
    next();

},  function(req,res,next){
	var avatar_id = '?avatar_id='+req.query.avatar_id;

	if(req.user){
		res.redirect('/users/' + req.user.username +avatar_id);
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

    let opts = {maxAge:90000};
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

router.get('/:username', passport.authenticate('jwt', {session: false}), function(req,res,next){
	res.render('profile', {foo: req.user.username});
});

module.exports = router;
