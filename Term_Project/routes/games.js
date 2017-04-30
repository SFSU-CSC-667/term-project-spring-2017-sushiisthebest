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
           console.log('Games Object:',games );
           next()
        })
}, (req, res, next) => {
    res.render('games', {games: res.locals.games })
});

router.post('/:gameID/join', (req, res, next) => {
    const gameID = req.params.gameID;
    Games.findGameByID(ParseInt(gameID))
        .then(game => {
            if(game.playercount >= 5)
        })

});

// router.get('/gamelobby/:id', (req, res, next) => {
//     Games.
//
//
//
// })

module.exports = router;