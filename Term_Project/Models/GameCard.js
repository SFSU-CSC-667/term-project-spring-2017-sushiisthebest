const db = require('../config/database');

   module.exports = {
       createNewDeck: (gameID, cards) =>{
           const query = 'INSERT INTO \"GameCard\" (gameid, cardid, cardorder) VALUES ($1, $2, $3)';
           var queries = [];

           return db.task(t=> {
               cards.forEach( (card,index) => {
                   queries.push(db.none(query, [gameID, card.id,index + 1]));
               });
               return t.batch(queries);
           });
       },

        drawNextCard: gameID =>{
               const initQuery = 'SELECT \"GameCard\".*, \"Card\".ruletext, \"Card\".ruletext, \"Card\".face, \"Card\".suit, \"Card\".value, '
                                + 'imagetable.path AS imgurl FROM \"GameCard\" INNER JOIN \"Card\" ON \"GameCard\".cardid = \"Card\".id'
                                +'INNER JOIN imagetable ON \"Card\".imageid = imagetable.id WHERE \"GameCard\".gameid = $1'
                                +' AND \"GameCard\".played = f ORDER BY \"GameCard\".cardorder LIMIT 1';

               return db.one(initQuery, gameID)
        },

       //TODO SOMEONE THINK OF A MORE DESCRIPTED NAME
       updatePlayed: gameCardID => {
           const query = 'UPDATE \"GameCard\" SET played = t WHERE id = $1';

           return db.none(query,gameCardID)
       }

};
