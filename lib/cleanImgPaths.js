#!/usr/bin/env node

const ImageTable = require('../Models/ImageTables');
const db = require('../config/database');

db.many('select * from imagetable where id < $1', 70)
    .then(images => {
        ImageTable.cleanPath(images)
            .then(results=> {
                console.log('success');
            })
            .catch(error => {
                console.log(error);
                console.log('failure');
            });
    })
    .catch(error => {
        console.log('error');
        console.log(error);
    })
