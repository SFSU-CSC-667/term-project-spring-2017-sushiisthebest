const fs = require('fs');
var path = require('path');
var pgp = require('pg-promise')();
var db = require('../config/database');

var GameCard = {
    createNewDeck: (gameid, cards) =>{
        var gid = gameid;
        Promise.all(cards.map(card => {
            var resolved_path = "/public/images/" + card;
            db.any('INSERT INTO \"GameCard\" (gameid, cardid, ruletext, name, imageid, played) VALUES ($1, $2, $3, $4, $5, $6)',
                [gid, cards.id, cards.ruletext, cards.name, cards.imageid, false])
            .then(() => {
                console.log("Created New Deck in \"GameCard\"");
            })
            .catch(err => {
                console.log(err);
            })
        }))
        .then(() => {
            console.log("done");
        })

    },

    drawNextCard: gameid =>{
        return db.oneOrNone({
            name: 'draw-next-card',
            text: 'SELECT * FROM \"GameCard\" WHERE \"GameCard\".played = false',
            values: []
        })
    }
};
