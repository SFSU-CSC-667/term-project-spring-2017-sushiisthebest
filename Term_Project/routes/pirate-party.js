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
const shuffle = require('../lib/pirate-party');


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
        .catch(error => {
            console.log(error);
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
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
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
            broadcast(req.app.get('io'), req.params.gameID, 'reset-targets', 'target animation reset');
            broadcast(req.app.get('io'), nextTurnUserName, 'take-turn', nextTurnUserName);
            res.json({msg:'hello'})
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        })
});


router.post('/:gameID/target/:playerID' , (req, res, next) => {
    console.log('event name', req.body.name);
    console.log('event heal', req.body.heal);
    console.log('event damage', req.body.damage);

    res.locals.players = [];

    if(req.body.name === 'you' || req.body.name === 'jack'){
        Player.damagePlayer(req.params.playerID, req.body.damage)
            .then(player => {
                console.log('Player:', req.params.playerID, 'damaged. Remaining Health =', player.health);

                res.json({msg:'success', player: player});
            })
            .catch(error => {
                console.log(error);
                res.sendStatus(500);
            });
    } else {
        Player.damagePlayer(req.params.playerID, req.body.damage)
            .then(player => {
                console.log('Player:', req.params.playerID, 'damaged. Remaining Health =', player.health);
                res.locals.players.push(player);
                next();
            })
            .catch(error => {
                console.log(error);
                res.sendStatus(500);
            });
    }


}, (req, res, next) => {
    Player.findPlayerByName(req.user.username)
        .then(player => {
            console.log('heal target found');
            console.log(player);
            res.locals.healTarget = player.id;

            next();
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        });


}, (req, res, next) => {
    console.log('final middle where');
    Player.healPlayer(res.locals.healTarget, req.body.heal)
        .then(player => {
            console.log('Player ')
            res.locals.players.push(player);
            res.json({msg:req.body.name, players:res.locals.players})
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        });
});


router.post('/:gameID/bard', (req, res, next) => {
    console.log('bard mw2');
    Games.getPlayers(req.params.gameID)
        .then(players => {
            res.locals.players = players;
            next();
        })
        .catch(error => {
            console.log(error);
        })

}, (req,res,next) => {
    console.log('bard mw2');
    Player.healPlayers(res.locals.players, req.body.heal)
        .then(players => {
            res.json({msg:'All players get healed', players: players});
        })
        .catch(error => {
            console.log(error);
        })
});

router.post('/:gameID/mayhem', (req, res, next) => {
    Games.getPlayers(req.params.gameID)
        .then(players => {
            res.locals.players = players;
            next();
        })
        .catch(error => {
            console.log(error);
        })


    //TODO  <<< animations
} , (req, res, next) => {
    let shuffledPlayers = shuffle(res.locals.players);
    let playersToHeal = [];
    let playersToDamage = [];
    let healLength = Math.floor(shuffledPlayers.length/2);
    let damageLength = shuffledPlayers.length - healLength;


   for(let i = 0; i<healLength ; i++){
        playersToHeal.push(shuffledPlayers.pop);
   }

    for(let i = 0; i<damageLength ; i++){
        playersToDamage.push(shuffledPlayers.pop);
    }

    res.locals.playersToHeal = playersToHeal;
    res.locals.playersToDamage = playersToDamage;

    next();

}, (res, req, next) => {
    Player.healPlayers(res.locals.playersToHeal, req.body.heal)
        .then(players => {
            res.locals.healedPlayers = players;
            next();
        })
        .catch(error => {
            console.log(error);
        })


},(res, req, next) => {
    Player.damagePlayers(res.locals.playersToDamage, req.body.damage)
        .then(players => {
            res.locals.damagedPlayers = players;
            next();
        })
        .catch(error => {
            console.log(error);
        })

},(req, res, next) => {
    let newArr = res.locals.damagedPlayers.concat(res.locals.healedPlayers);
    res.json({msg:'mayham', players:newArr});
});


router.post('/:gameID/me', (req, res, next) => {
    console.log('ME MW 1');
    Player.findPlayerByName(req.user.username)
        .then(player => {
            res.locals.playerID = player.id;
            next();
        })
        .catch( error => {
            console.log('me error in mw 1 ');
            console.log(error);
        })




}, (req,res,next) =>{
    console.log('ME MW 2');
   let io = req.app.get('io');

   console.log('damage field in body:', req.body.damage);
   Player.damagePlayer(res.locals.playerID, req.body.damage)
       .then(player => {
           const debugMSG = '(ME) Player With Username: ' + req.user.username + ' takes 10 damage ' +
               '\nRemaining Health: ' + player.health;
           console.log(debugMSG);
           res.json({msg:'msg', player: player});
       })
       .catch(error => {
           console.log(error);
           res.sendStatus(500);
       })
});

router.post('/:gameID/wenches', (req,res,next) => {
    console.log('wenches middleware 1');

    Games.getPlayers(req.params.gameID)
        .then(players => {
            console.log(players);
            let targets = [];
            players.forEach( player => {
                if(player.avatarid === 3){
                    targets.push(player);
                }
            });

            if (targets.length === 0){
                res.json({msg:'no dudes'});
            } else {
                res.locals.targets = targets;
                next();
            }
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        })
}, (req,res,next) => {
    console.log('wenches middleware 2');
    Player.damagePlayers(res.locals.targets, req.body.damage)
        .then(players => {
            console.log('Players object');
            let debugMSG = '(Wenches) Mail Avatars takes 10 damage ' +
                '\nRemaining Health: [';
            players.forEach(player => {
                debugMSG +=  player.health + ', ';

            });
            debugMSG += ']';
            console.log(debugMSG);

            const msg = "success";
            res.json({msg:msg, players: players});
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        })
});

router.post('/:gameID/dudes', (req,res,next) => {
    console.log('dudes middleware 1');
    console.log('getting dudes from game:', req.params.gameID);

    Games.getPlayers(req.params.gameID)
        .then(players => {
            console.log(players);
            let targets = [];
            players.forEach( player => {
                if(player.avatarid !== 3){
                    targets.push(player);
                }
            });

            if (targets.length === 0){
                res.json({msg:'no dudes'});
            } else {
                res.locals.targets = targets;
                next();
            }
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        })

}, (req,res,next) => {
    console.log('dudes middleware 2');
    Player.damagePlayers(res.locals.targets, req.body.damage)
        .then(players => {
            console.log('Players object');
            let debugMSG = '(Wenches) Mail Avatars takes 10 damage ' +
                '\nRemaining Health: [';
            players.forEach(player => {
                debugMSG +=  player.health + ', ';

            });
            debugMSG += ']';
            console.log(debugMSG);

            const msg = "success";
            res.json({msg:msg, players:players});
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        })

});

router.post('/:gameID/king', (req,res,next)=> {
    console.log('Pirate Party King Route');
    GameCards.getKings(req.params.gameID)
        .then(kings => {
            let allKingsDrawn = true;
            kings.forEach(king => {
                if(king.played === false){allKingsDrawn = false;}
            });

           if(allKingsDrawn){next('route')}

           next();
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        })

}, (req, res, next) =>{
    console.log('King Route Main Branch mw 2');
    Games.getPlayers(req.params.gameID)
        .then(players =>{
            res.locals.players = players;
            next();
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        })

}, (req, res, next) => {
    console.log('King Route Main Branch mw 3');
    Player.damagePlayers(res.locals.players, req.body.damage)
        .then(players => {
            res.json({msg: 'yolo', players: players});
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        })
});

router.post('/:gameID/king' , (req, res, next) => {
    console.log('King Route OHHHH FUCK Branch mw 1');
    Player.findPlayerByName(req.user.username)
        .then(player => {
            res.locals.player = player;
            next()
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        })
}, (req, res, next) => {
    console.log('King Route OHHHH FUCK Branch mw 2');
    console.log ('DEALING OH FUCK LAST KING DAMAGE');
    Player.damagePlayer(res.locals.player.id, req.body.ohFuckDamage)
        .then(player => {
            console.log('PlayerID:',res.locals.player.id,',','health after last king');
            res.json({msg:'success', players:player});
        })
});

router.post('/:gameID/bomb' , (req, res, next) => {
   Games.getPlayers(req.params.gameID)
       .then(players => {
            res.locals.players = players;
            next();
       })
       .catch(error => {
           console.log(error);
       })
}, (res, req, next) => {
    let shuffledPlayers = shuffle(res.locals.players);

    Player.damagePlayer(shuffledPlayers.pop().id, req.body.damage)
        .then(player => {
           console.log(player);
           res.json({msg:'bomb', players: player});
        })
        .catch(error => {
            console.log(error);
        })
});




module.exports = router;