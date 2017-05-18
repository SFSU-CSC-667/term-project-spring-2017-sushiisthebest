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

}, (req, res, next) => {
    broadcast(req.app.get('io'),req.params.gameID,'card-drawn',res.locals.card);
    res.json(res.locals.card);
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

})




module.exports = router;