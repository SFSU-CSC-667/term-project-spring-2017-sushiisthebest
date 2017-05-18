/**
 * Created by euphoric on 4/26/17.
 */

const express = require('express');
const router = express.Router();

const Games = require('../Models/Games');
const GameCard = require('../Models/GameCard');
const Player = require('../Models/Player');
const Cards = require('../Models/Cards');

const passport = require('passport');
const broadcast = require('../socket/broadcast');
const shuffle = require('../lib/shuffle');
const turnControl = require('../lib/turn-control');


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


router.get('/create', (req, res, next) => {
    res.render('createGame');
});


//TODO improve to check if a game with that name arleady exists
router.post('/create', passport.authenticate('jwt',{session:false}), (req, res, next) => {
    Games.create(req.body.game_name, req.body.game_description)
        .then(game => {
            console.log('Creating Game ID =', game.id);
            return Promise.all([game.id, Player.create(req.user.id, game.id)]);
        })
        .then(results => {
            // const response = {currentGameId: results[0], path: '/games/' + results[0], currentPlayerId: results[1]};
            const response = {currentGameId: results[0], path: '/games/' + results[0]};
            console.log('results at index 1:', results[1]);
            res.status(200).json(response);
        })
        .catch(error => {
          console.log("Game is not unique... probablly", error);
          res.redirect('/')
        })
});


router.post('/join', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let gameID = req.body.gameid;
    console.log('gameID posted to server: ',req.body.gameid);


    Games.findGameByID(gameID)
        .then(game => {

            //TODO THIS TEST THIS BLOCK
            if(gameID === undefined){
                console.log('gameid undefined');
                res.json({msg:'Game Is No Longer Available', path: null})
            }

            if(game.playercount >= 5 || game.hasstarted === true){
                //TODO needs to inform the user that the game is full
                console.log('game is full');
                res.json({msg:'Game Has Already Started ... Updating list', path:null});
            }

            //TODO END OF TEST BLOCK

            return Promise.all([game.id , Player.create(req.user.id, gameID, game.playercount)]);
        })
        .then(results => {
            broadcast(req.app.get('io'), results[0], 'user-joined', req.user.username);

            console.log('results index 1', results[1]);
            res.status(200).json({
                msg:'success',
                path: '/' + results[0],
                currentGameId: results[0]
                });
        })
        .catch(error => {
            console.log(error);
        })

});


router.post('/leave',passport.authenticate('jwt', {session:false}),(req, res, next) => {
    console.log('leave route entered');
    Player.destroyPlayer(req.user.id, req.body.gameid)
        .then(results => {
            broadcast(req.app.get('io'),req.body.gameid, 'user-left');
            res.json({path:'/games'})
        })
        .catch(error => {
            console.log('error in leave route');
            console.log(error);
        })
});


router.post('/start', (req, res, next)=> {
    Games.hasStarted(req.body.gameid)
        .then(game => {
            //TODO THIS IS TEMPORARY!!!!!! needs to actually do more, THIS WILL ESENTIalLY RELOUD THE VIEW
            //TODO FOR EVERYONE. if someone disc... this only to make my life easier for now
            if(game.hasstarted === true) {
                broadcast(req.app.get('io'), req.body.gameid, 'start-game', req.body.gameid);
                res.json({gameID:req.body.gameid});
            } else {
                next('route');
            }
        })
});

router.post("/start", passport.authenticate('jwt', {session:false}), (req,res,next) => {
    console.log('GameID: in start route:',req.body.gameid);
    console.log('/Start middleware 1');
    Games.startGame(req.body.gameid)
        .then(()=>{
           next();
        })
        .catch(error => {
            console.log(error);
            console.log('Error in start route');
        })

}, (req, res, next) => {
    console.log('/start middleware 2');
    Cards.getPlayingCards()
        .then(cards => {
            //console.log(cards);
            res.locals.cards = shuffle(cards);
            next();
        })
        .catch(error => {
            console.log(error);
            res.send(500);
        })

}, (req, res, next) => {
    console.log('/start middle ware 3');
        GameCard.createNewDeck(req.body.gameid, res.locals.cards)
            .then(results => {
                console.log('hello');
                broadcast(req.app.get('io'),req.body.gameid,'start-game',req.body.gameid);
                broadcast(req.app.get('io'),req.user.username, 'take-turn', 'hello');
                res.json({gameID: req.body.gameid})
            })
            .catch(error => {
                console.log('error in create new deck');
                console.log(error);
                res.send(500);
            })
 });


router.get('/:gameID', (req, res, next) => {
   let view = {
       gameName: '',
       statusMessage: '',
       currentCardURL: undefined,
       players: []
   };

   Games.getLobby(req.params.gameID)
       .then(lobby => {
            view.gameName = lobby[0].gamename;
            view.statusMessage = "Waiting For Players";

            lobby.forEach(item => {
                let player = {
                    id: item.id,
                    username: item.username,
                    path: item.imageurl
                };
                view.players.push(player);

            });
           res.locals.lobby = lobby;
           res.locals.view = view;
           next();
       });

}, (req, res, next) => {
        res.render('gamelobby',res.locals.view);
});


module.exports = router;