const db = require('../config/database');

module.exports = {
    findImageByID: id =>{
        return db.oneOrNone({
            name: 'find-image-by-id',
            text: 'SELECT * FROM \"imagetable\" WHERE id = $1' ,
            values: [id]
        })
    },

    cleanPath: images => {
        let queries = [];
        let query = "Update imagetable SET path = $1 WHERE id = $2";

        return db.task(t => {
                    images.forEach(image => {
                        let temp = image.path.split('/');
                        temp.shift(); temp.shift();
                        let newpath = temp.join('/');
                        newpath = '/images/PNG-cards-1.3' + newpath;
                        console.log(newpath);
                        queries.push(db.none(query, [newpath, image.id]))
                    });
                    return t.batch(queries)
                })

    },

    translatePlayingCards: images => {
        let queries = [];
        let query = 'update \"Card\" set imageid =$1 where suit = $2 AND value = $3';

        return db.task(t => {
            images.forEach(image => {
                let temp = image.name.split('.');
                let array = temp[0].split('_');
                console.log('value:', array[0]);
                console.log('suit:', array[2]);
                console.log('image id:', image.id);

                switch (array[0]) {
                    case 'ace': array[0] = 1; break;
                    case'king': array[0] = 13; break;
                    case 'queen': array[0] = 12; break;
                    case'jack': array[0] = 10; break;
                }
                queries.push(db.none(query, [image.id, array[2], array[0]]))
            });
            return t.batch(queries);
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