var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../Models/User');
var debug = true;

router.get('/',function(req, res, next){
	res.render('register');
});

router.post('/', function(req, res, next){
	User.findUserByEmail(req.body.email)
	.then(user=>{
		if(!user){
			console.log('Sucess: user does not already exist');
			next()
		} else {
			console.log('email already in use');
		}
	})
}, function(req, res, next){
	bcrypt.hash(req.body.password, 10)
	.then(hash =>{
		debug ? console.log("Hash: ", hash): null;
		debug ? console.log("Attempting to insert email:", req.body.email, "username:",req.body.username, "password:", req.body.password) : null;
		User.create(req.body.email, req.body.username, req.body.password)
		.then(()=>{66
			res.redirect('/login');
		})
		.catch(error=>{
			console.log(error);
		})
	})
});

module.exports = router;