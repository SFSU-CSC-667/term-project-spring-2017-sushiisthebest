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

    drawNextCard: gameid =>{
        return db.oneOrNone({
            name: 'draw-next-card',
            text: 'SELECT * FROM \"GameCard\" WHERE \"GameCard\".played = false',
            values: []
        })
    }
};
