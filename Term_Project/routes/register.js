var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../Models/User');

router.get('/',function(req, res, next){
	res.render('register');
});

router.post('/', function(req, res, next){
	User.getUser(req.body.email)
	.then(user=>{
		if(!user){
			next()
		} else {
			console.log('email already in use');
		}
	})
}, function(req, res, next){
	bcrypt.hash(req.body.password, 10)
	.then(hash =>{
		User.create(req.body.email, req.body.username, req.body.password)
		.then(()=>{
			res.redirect('/login');
		})
		.catch(error=>{
			console.log(error);
		})
	})
});

module.exports = router;