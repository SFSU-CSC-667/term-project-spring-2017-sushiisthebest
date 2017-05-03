/**
 * Created by euphoric on 4/26/17.
 */

const express = require('express');
const router = express.Router();

const Games = require('../Models/Games');
const Player = require('../Models/Player');

const passport = require('passport');
const broadcast = require('../socket/broadcast');



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

//TODO improve to check if a game with that name arleady exists
router.post('create', passport.authenticate('jwt',{session:false}), (req, res, next) => {
    Games.create(req.body.gameName, req.body.gameDescription)
        .then(gameID => {
            return Promise.all([gameID, Player.create(req.user.id, gameID)]);
        })
        .then(results => {enou
            console.log('GameID:', results[0]);

            res.send('Game Created ID:', [results[0]])
        })
});

router.post('/:gameID/join', (req, res, next) => {
    const gameID = req.params.gameID;
    Games.findGameByID(ParseInt(gameID))
        .then(game => {
            if(game.playercount >= 5 || game.hasstarted === true){
                broadcast(req.app.get('io'), '')
            }
        })

});

router.get('/:gameID', (req, res, next) => {
    let view = {};
        Games.getLobby(req.params.gameID)
            .then(players => {

            })
    })

})

module.exports = router;