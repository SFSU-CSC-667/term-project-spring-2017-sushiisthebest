var express = require('express');
var router = express.Router();

var pgp = require('pg-promise')();

var connection = {
  host: "localhost",
  port: 5432,
  database: "csc667",
  user: 'postgres',
  password: "6848broken"
};

var db = pgp(connection);



router.get('/',function(req, res, next){
	res.render('register');
});

router.post('/', function(req, res, next){

});

module.exports = router;