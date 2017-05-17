/**
 * Created by euphoric on 5/11/17.
 */
const db = require('../config/database');

const express = require('express');
const router = express.Router();

const Games = require('../Models/Games');
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

// router.get('/test', (req,res, next) => {
//     db.any('SELECT * FROM \"Card\"')
//         .then(cards => {
//             res.locals.cards = cards;
//             next();
//         })
//
//     }, (req, res) => {
//      console.log(res.locals.cards);
//      res.json('success');
// });





module.exports = router;