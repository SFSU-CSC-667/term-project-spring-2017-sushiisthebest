var express = require('express');
var router = express.Router();

var connection = 
	host: "localhost",
	port: 5432,
	database: "csc667",
	user: 'postgres',
	password: "6848broken"
}

var db = pgp(connection)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
