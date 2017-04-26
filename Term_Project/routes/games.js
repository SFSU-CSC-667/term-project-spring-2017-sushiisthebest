/**
 * Created by euphoric on 4/26/17.
 */

var express = require('express');
var router = express.Router();


router.get('/' , (req, res, next) => {
    res.render('games');
});