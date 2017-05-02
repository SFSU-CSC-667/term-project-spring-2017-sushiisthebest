/**
 * Created by euphoric on 4/26/17.
 */

const express = require('express');
const router = express.Router();

const Games = require('../Models/Games');
const broadcast = require('../socket/broadcast')




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

router.post('/:gameID/join', (req, res, next) => {conf
    const gameID = req.params.gameID;
    Games.findGameByID(ParseInt(gameID))
        .then(game => {
            if(game.playercount >= 5 || game.hasstarted == true){
                req.app.get('io')
            }
        })

});

// router.get('/gamelobby/:id', (req, res, next) => {
//     Games.
//
//
//
// })

module.exports = router;