var express  = require('express');
var router = express.Router();
var passport = require('passport'), LocalStrategy = require('passport-local');



router.get('/',function(req,res,next){
	res.render('login');
});

router.post('/',function(req, res, next){
	var username = req.body.username;
	var password = req.body.password;
});

module.exports = router;