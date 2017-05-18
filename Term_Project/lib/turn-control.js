/**
 * Created by euphoric on 5/17/17.
 */
const Game =  require('../Models/Games');
const User = require('../Models/User');


module.exports = {
    init:(req,res,next) => {
        const userQuery = 'SELECT \"Player\".id FROM \"User\" ' +
            'INNER JOIN \"Player\" ON \"User\".id = \"Player\".userid ' +
            'WHERE \"User\".id = $1';
        const gameQuery = 'UPDATE \"Game\" SET playerturnid = $1 WHERE id = $2';


    },


    //TODO NAME PENDING
    getNextTurn: (req, res, next) => {
        Game.getCurrentTurn(req.params.gameID)
            .then(game => {
                console.log(game.playerturnid)
                res.locals.playerTurnID = game.playerturnid;
            next();
            })
    }


};