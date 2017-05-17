#!/usr/bin/env node
const db = require('../config/database');
const ImageTable = require('../Models/ImageTables');



db.many('select * from imagetable where id > 73')
.then(images => {
   ImageTable.translatePlayingCards(images)
       .then(()=>{
        console.log(success);
       })
       .catch(error => {
           console.log(error)
       })
});