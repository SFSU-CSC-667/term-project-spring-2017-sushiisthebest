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
router.post('/create', passport.authenticate('jwt',{session:false}), (req, res, next) => {
    Games.create(req.body.game_name, req.body.game_description)
        .then(gameID => {
            console.log('about to call Promise.ALL');
            console.log('user id from cookie:', req.user.id);

            return Promise.all([gameID.id, Player.create(req.user.id, gameID.id)]);
        })
        .then(results => {
            console.log('GameID:', results[0]);
            res.status(200).send('Success');
            //res.redirect('/'+ results[0].id);
        })
        .catch(err => {
          console.log("Error in post /create route", error);
        })
});

router.post('/join', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    let gameID = req.body.gameid;

    console.log(req.body);

    console.log('gameID posted to server: ',req.body.gameid);
    //if(!req.query.id) {res.redirect('/') }

    Games.findGameByID(gameID)
        .then(game => {

            if(gameID === undefined){
                console.log('gameid undefined');
                res.json({msg:'Game Is No Longer Available', path: null})
            }

            if(game.playercount >= 5 || game.hasstarted === true){
                //TODO needs to inform the user that the game is full
                console.log('game is full');
                res.json({msg:'Game Has Already Started ... Updating list', path:null});
            }

            return Promise.all([game.id , Player.create(req.user.id, gameID)]);
        })
        .then(results => {
            console.log('results index zero:', results[0]);
            res.status(200).json({
                msg:'success',
                path:'/' + results[0],
                currentGameId: results[0]
                });
        })

});

router.get("/test", (req,res,next) => {
   const io = req.app.get('io');
   broad
});

router.get('/:gameID', (req, res, next) => {
   let view = {
       gameName: '',
       statusMessage: '',
       players: []
   };
   console.log('game id from url: ', req.params.gameID);

   Games.getLobby(req.params.gameID)
       .then(lobby => {
            view.gameName = lobby[0].gamename;
            view.statusMessage = "Waiting For Players";

            console.log('Getting:', view.gameName);


            lobby.forEach(item => {
                console.log('item id:',item.id,'item username:',item.username,'item path:', item.imageurl);
                let player = {
                    id: item.id,
                    username: item.username,
                    path: item.imageurl
                };

                console.log(player);

                view.players.push(player);
            });
           console.log(view);
           res.render('gamelobby', view);
       });
});





module.exports = router;