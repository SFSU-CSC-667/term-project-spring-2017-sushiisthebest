#!/usr/bin/env node
const fs = require('fs');
// const parser = require('csv-parse');
const csv = require('csv');
const parser = require('csv-parse/lib/sync');

var path = require('path');
var pgp = require('pg-promise')();

var connection = {
    host: "localhost",
    port: 5432,
    database: "csc667",
    user: 'postgres',
    password: "6848broken"
};

var db = pgp(connection);

const PATH_TO_CSV = '/home/euphoric/NodeJsApps/CSC667/term-project-spring-2017-sushiisthebest/Term_Project/public/csv/deck.csv';


let text = fs.readFileSync(PATH_TO_CSV, 'utf8');

//console.log('raw text', text);

let string = text.toString('utf8');

console.log(string);

let records = parser(string);

console.log(records);


//
//
// Promise.all(files.map(file=>{
//     var resolved_path = "/public/images/" + file;
//     db.any("INSERT INTO imagetable(path, name) VALUES($1, $2)" ,[resolved_path,file])
//         .then(()=>{
//             console.log('name:',file, 'path:',resolved_path, 'added to imagetable');
//         })
//         .catch(err =>{
//             console.log(err);
//         })
// }))
//     .then(()=>{
//         console.log("done");
//     });