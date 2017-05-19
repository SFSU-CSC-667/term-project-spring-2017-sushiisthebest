/**
 * Created by euphoric on 5/11/17.
 */
const db = require('../config/database');

const express = require('express');
const router = express.Router();

const Games = require('../Models/Games');
const GameCards = require('../Models/GameCard');
const Cards = require('../Models/Cards');
const Player = require('../Models/Player');

const turnControl = require('../lib/turn-control');
const passport = require('passport');
const broadcast = require('../socket/broadcast');
const PirateParty = require('../lib/pirate-party');

router.use(passport.authenticate('jwt', {session:false}));

router.get('/load-view/:gameID', (req, res, next) =>{
    let view = {
        currentCardURL: undefined,
        players: undefined
    };

    Games.getLobby(req.params.gameID)
        .then(lobby => {
            if(lobby[0].currentcard){
                res.locals.view = view;
                res.locals.lobby = lobby;
                next('route');
            } else {
                view.players = lobby;
                res.render('game-table', view);
            }
        })
});

router.get('/load-view/:gameID', (req, res, next) => {
    console.log(res.locals.lobby[0].currentcard);
    Cards.findCardByID(res.locals.lobby[0].currentcard)
        .then(card => {
            res.locals.view.currentCardURL = card.path;
            res.locals.view.players = res.locals.lobby;

            console.log('Card Path', card.path);
            res.render('game-table', res.locals.view);
        })
        .catch(error => {
            console.log(error);
            console.log('Error in load-view Cards.findCardByID.then()');

        })
});

router.get('/draw/:gameID', (req,res,next) =>{
    GameCards.drawNextCard(req.params.gameID)
        .then(card => {
            res.locals.card = card;
            console.log(card);
            next();
        })
        .catch(error => {
            console.log(error);
        })

}, (req, res, next) => {
    GameCards.updatePlayed(res.locals.card)
        .then(()=>{
            console.log('success');
            next();
        })
        .catch(error => {console.log(error)})

}, PirateParty.checkCard, (req, res, next) => {

    broadcast(req.app.get('io'),req.params.gameID,'card-drawn',res.locals.card);
    res.json(res.locals.clientCard);
});



router.post('/:gameID/next-turn', (req, res, next) =>{
    Games.getCurrentTurn(req.params.gameID)
        .then(game => {
            console.log('current player turn', game.playerturnid);
            let nextPlayerNumber;
            game.turnorder === game.playercount ? nextPlayerNumber = 1 : nextPlayerNumber = game.turnorder+1;

            //res.locals.playerTurnID = game.playerturnid;
            res.locals.playerOrder = nextPlayerNumber;
            next();
        })

}, (req,res,next) => {

    let newPlayerId;
    let nextTurnUserName;

    db.task(t=> {
        const query = 'SELECT \"Player\".id, \"User\".username FROM \"Player\" INNER JOIN \"User\" ' +
            'ON \"Player\".userid = \"User\".id WHERE gameid = $1 AND turnorder = $2';
        return db.one(query, [req.params.gameID,res.locals.playerOrder])
            .then(player => {
                newPlayerId = player.id;
                nextTurnUserName = player.username;
                console.log('newPlayeriD', newPlayerId);
                console.log('nextTurnUsername', nextTurnUserName);
                return db.none("UPDATE \"Game\" SET playerturnid=$1 WHERE id= $2",[player.id, req.params.gameID])
            })
    })
        .then(()=>{
            broadcast(req.app.get('io'), nextTurnUserName, 'take-turn', nextTurnUserName);
            res.json({msg:'hello'})
        })
});


router.post('/:gameID/target/:playerID' , (req, res, next) => {
    console.log(req.body.damage);
    Player.damagePlayer(req.params.playerID, req.body.damage)
        .then(player => {
            console.log('Player:', req.params.playerID, 'damaged. Remaining Health =', player.health);
            res.json({msg:'success'});
        })
});

router.post('/:gameID/me/:playerID', (req,res,next) =>{
   let io = req.app.get('io');
   Player.damagePlayer(req.params.playerID, req.body.damage)
       .then(player => {
           res.json({health: player.health});
       })
});

router.post('/:gameID/wenches', (req,res,next) => {
    console.log('wenches middleware 1');
    Games.getWenches(req.params.gameID)
        .then(wenches => {
            res.locals.wenches = wenches;
            next();
        })

}, (req,res,next) => {
    console.log('wenches middleware 2');
    Player.damagePlayers(res.locals.wenches)
        .then(results => {
            console.log('results');
            const msg = "success";
            res.json({msg:msg});
            })

});

router.post('/:gameID/dudes', (req,res,next) => {
    console.log('dudes middleware 1');
    Games.getWenches(req.params.gameID)
        .then(dudes => {
            res.locals.dudes = dudes;
            next();
        })

}, (req,res,next) => {
    console.log('dudes middleware 2');
    Player.damagePlayers(res.locals.dudes)
        .then(results => {
            console.log('results');
            const msg = "success";
            res.json({msg:msg});
        })

});

router.post('/:gameID/king', (req,res,next)=> {

});




module.exports = router;