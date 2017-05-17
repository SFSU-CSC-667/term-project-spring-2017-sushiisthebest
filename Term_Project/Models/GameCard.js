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
            const initQuery = 'SELECT \"GameCard\".*, \"Card\".ruletext, \"Card\".face, \"Card\".value, '
                                + 'imagetable.path AS imgurl FROM \"GameCard\" INNER JOIN \"Card\" ON \"GameCard\".cardid = \"Card\".id'
                                +' INNER JOIN imagetable ON \"Card\".imageid = imagetable.id WHERE \"GameCard\".gameid = $1'
                                +' AND \"GameCard\".played = false ORDER BY \"GameCard\".cardorder LIMIT 1';
                return db.one(initQuery, gameID)
        },

       //TODO SOMEONE THINK OF A MORE DESCRIPTED NAME
       updatePlayed: gameCard => {
           const query = 'UPDATE \"GameCard\" SET played = true WHERE id = $1';
           const gameQuery = 'UPDATE \"Game\" SET currentcard = $1 WHERE id = $2';

           return db.task(t => {
               console.log('GameCard ID DRAWN:', gameCard.id);
               console.log('GameCard Card ID DRAWN:',gameCard.cardid);
               console.log('GameCard GAME ID' , gameCard.gameid);
              return t.batch([
                  db.none(query, [gameCard.id]), db.none(gameQuery,[gameCard.cardid, gameCard.gameid])])
           })
       }


};
