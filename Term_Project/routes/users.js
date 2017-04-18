var express = require('express');
var router = express.Router();
var debug = true;
var bcrypt = require('bcrypt');
var User = require('../Models/User');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ensureLoggedIn = require('connect-ensure-login');
require('../config/passport.js')(passport);


/* GET users listing. */

router.get('/', function(req,res,next){
	if(req.user){
		debug ? console.log("sessions appear to be working") : null;
		debug ? console.log("user session object:", req.user) : null;
		res.redirect('/users/' + req.user.id);
	} else {
		debug ? console.log("not logged in ???") : null;
	}
});

router.get('/login',function(req,res,next){
	res.render('login');
});

router.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/users',
												  failureRedirect: 'users/login'	}));

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

router.get('/:id([0-9]{1-8})', ensureLoggedIn.ensureLoggedIn('users/login'), function(req,res,next){
	console.log('in get /:id route','user: ', req.user, 'user id;', req.user.id);
	res.render('profile', {foo: req.user.id});

});

module.exports = router;
