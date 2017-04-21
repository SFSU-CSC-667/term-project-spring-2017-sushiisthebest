var express = require('express');
var app = express();
var router = express.Router();
var debug = true;
var bcrypt = require('bcrypt');
var User = require('../Models/User');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jwt-simple');

require('../config/passport.js')(passport);
var io = require('socket.io').listen()

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
	//if(req.user){re}
	res.render('login', {token_url: "/javascripts/token.js"});
});

router.post('/login', function(req, res, next){
	passport.authenticate('local', function(error,user, info){
    if (error) { return next(err) }
    if (!user) {
      return res.json(401, { error: 'some fucked up shizz' });
    }

    //user has authenticated correctly thus we create a JWT token 
    var token = jwt.encode({id: user.id, username: user.username, email: user.email}, "secret");
    
    res.json({token: token});


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

router.get('/:id([0-9]{1-8})', function(req,res,next){
	console.log('in get /:id route','user: ', req.user, 'user id;', req.user.id);
	res.render('profile', {foo: req.user.id});

});

module.exports = router;
