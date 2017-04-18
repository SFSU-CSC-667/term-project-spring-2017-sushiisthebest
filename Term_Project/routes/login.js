var express  = require('express');
var router = express.Router();

var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

require('../config/passport.js')(passport);




router.get('/',function(req,res,next){
	res.render('login');
});

router.post('/', passport.authenticate('local', { successRedirect: 'http://www.google.com',
												  failureRedirect: '/login'	}));

module.exports = router;