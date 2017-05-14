/**
 * Created by euphoric on 5/11/17.
 */
const express = require('express');
const router = express.Router();

const Games = require('../Models/Games');
const Player = require('../Models/Player');

const passport = require('passport');
const broadcast = require('../socket/broadcast');


router.get('/:gameid', (req, res) => {
   let view = {};
   Games.getLobby(req.params.gameid)
       .then(players => {
          view.players = players;
           res.render('game-table', view);
       })
});




module.exports = router;