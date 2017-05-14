#!/usr/bin/env node
const fs = require('fs');
// const parser = require('csv-parse');
const csv = require('csv');
const parser = require('csv-parse/lib/sync');
const Cards = require('../Models/Cards');

var path = require('path');
var pgp = require('pg-promise')();

var connection = {
    host: "localhost",
    port: 5432,
    database: "csc667",
    user: 'postgres',
    password: "6848broken"
};

const db = pgp(connection);

const PATH_TO_CSV = '/home/euphoric/NodeJsApps/CSC667/term-project-spring-2017-sushiisthebest/Term_Project/public/csv/deck.csv';


let text = fs.readFileSync(PATH_TO_CSV, 'utf8');
let string = text.toString('utf8');
let records = parser(string);


Promise.all(records.map( record => {
    //function that is applied to every element of the array
    Cards.create(record)
    .then(()=> {
        console.log('card', record);
    })
    .catch(error => {
        console.log(error);
    })

}))
    .then(()=> {
        console.log('success');
    });
