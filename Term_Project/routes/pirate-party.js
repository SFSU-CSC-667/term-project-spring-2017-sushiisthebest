/**
 * Created by euphoric on 5/11/17.
 */
const express = require('express');
const router = express.Router();

const Games = require('../Models/Games');
const Player = require('../Models/Player');

const passport = require('passport');
const broadcast = require('../socket/broadcast');


router.get('/', (req, res) =>{
   res.render('game-table');
});


module.exports = router;