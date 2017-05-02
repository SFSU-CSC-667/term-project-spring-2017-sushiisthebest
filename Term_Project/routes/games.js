/**
 * Created by euphoric on 4/26/17.
 */

const express = require('express');
const router = express.Router();

const Games = require('../Models/Games');
const Player = require('../Models/Player');

const broadcast = require('../socket/broadcast');

 fo


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


//might not be an actual page at one point
router.get('/create', (req, res, next) => {
    res.render('createGame');
});

router.post('create', (req, res, next) => {

    Games.create(req.body.gameName,)
})

router.post('/:gameID/join', (req, res, next) => {
    const gameID = req.params.gameID;
    Games.findGameByID(ParseInt(gameID))
        .then(game => {
            if(game.playercount >= 5 || game.hasstarted === true){
                broadcast(req.app.get('io'), '')
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