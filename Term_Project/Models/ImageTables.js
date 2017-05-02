var db = require('../config/database');

module.exports = {
    findImageByID: id =>{
        return db.oneOrNone({
            name: 'find-image-by-id',
            text: 'SELECT * FROM \"imagetable\" WHERE id = $1' ,
            values: [id]
        })
    },

    create:(id, path, name) => {
        return db.none({
            name:'create-image',
            text: 'INSERT INTO \"imagetable\"(id, path, name) VALUES ($1, $2, $3)',
            values: [id,name,hashstarted, playerturnid, minigameturn, 1]
        })
            .then(new_game_id => {
                console.log('new image added to imagetable with id:', new_image_id);
                return new_image_id;
            })

    }


};