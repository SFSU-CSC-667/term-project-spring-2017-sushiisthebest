var express = require('express');
var router = express.Router();

const app = require('../app.js');

var io = app.get('io');


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express~' });
});

module.exports = router;
