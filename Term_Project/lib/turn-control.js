/**
 * Created by euphoric on 5/17/17.
 */
const Game =  require('../Models/Games');
const User = require('../Models/User');


module.exports = {
    init:(req,res,next) => {
        db.task(t=> {
            return User.getPlayer(req.user.id)
                .then(player =>{
                    return Game.updatePlayerTurnID(req.body.id, player.id)
                })
        })
            .then(()=> {
                next();
            })
            .catch(error => {
                console.log(error);
                console.log('error in turn control . init middleware');
            })
    },


    //TODO NAME PENDING
    getPlayerTurn: (req, res, next) => {
        Game.getCurrentTurnPlayerID(req.params.gameID)
            .then(game => {
                console.log(game.playerturnid)
                res.locals.playerTurnID = game.playerturnid;
            })
    }
};