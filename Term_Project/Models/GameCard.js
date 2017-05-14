const db = require('../config/database');

   module.exports = {
       createNewDeck: (gameid, cards) =>{
            return Promise.all(cards.map(card => {
                console.log('Adding Card INDEX:',card.index);
                const query = 'INSERT INTO \"GameCard\" (gameid, cardid, cardorder) VALUES ($1, $2, $3)';
                db.any(query, [gameid, card.id, cards.index])
                .then(results => {
                    console.log("Created new deck for Game ID:", gameid);
                })
                .catch(error => {
                    console.log(error);
                })
            }))
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
