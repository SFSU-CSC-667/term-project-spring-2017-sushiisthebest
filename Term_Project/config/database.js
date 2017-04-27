var connection = {
    host: "localhost",
    port: 5432,
    database: "csc667",
    user: 'postgres',
    password: "6848broken"
};

var pgp =  require('pg-promise')();
var db = pgp(connection);

module.exports = db;