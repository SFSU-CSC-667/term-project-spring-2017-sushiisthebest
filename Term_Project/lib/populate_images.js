#!/usr/bin/env node

const fs = require('fs');
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



var files = fs.readdirSync("/home/euphoric/NodeJsApps/CSC667/term-project-spring-2017-sushiisthebest/Term_Project/public/images/PNG-cards-1.3");

Promise.all(files.map(file=>{
	var resolved_path = "/images/PNG-cards-1.3/" + file;
	db.any("INSERT INTO imagetable(path, name) VALUES($1, $2)" ,[resolved_path,file])
	.then(()=>{
		console.log('name:',file, 'path:',resolved_path, 'added to imagetable');
	})
	.catch(err =>{
		console.log(err);
	})
}))
.then(()=>{
	console.log("done");
});