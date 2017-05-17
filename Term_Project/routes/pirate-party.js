/**
 * Created by euphoric on 5/11/17.
 */
const db = require('../config/database');

const express = require('express');
const router = express.Router();

const Games = require('../Models/Games');
const GameCards = require('../Models/GameCard');
const Player = require('../Models/Player');

const passport = require('passport');
const broadcast = require('../socket/broadcast');


router.get('/load-view/:gameid', (req, res) => {
   let view = {};
   Games.getLobby(req.params.gameid)
       .then(players => {
          view.players = players;
           res.render('game-table', view);
       })
});

router.post('/draw/:gameid', (req,res,next) =>{
    GameCards.drawNextCard(req.params.gameid)
        .then(card => {
            res.locals.card = card;
            console.log(card);
            next();
        })
        .catch(error => {
            console.log(error);
        })
}, (req, res, next) => {
    GameCards.updatePlayed(res.locals.card.id)
        .then(()=>{
            console.log('success');
            next();
        })
}, (req, res, next) => {

})




module.exports = router;