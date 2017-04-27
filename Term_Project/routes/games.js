/**
 * Created by euphoric on 4/26/17.
 */

var express = require('express');
var router = express.Router();
var Games = require('../Models/Games');




router.get('/' , (req, res, next) => {
    Games.getVisibleGames()
        .then(games => {
           res.locals.games = games;
           next()
        })
}, (req, res, next) => {
    res.render('games', {games: res.locals.games })
});


module.exports = router;