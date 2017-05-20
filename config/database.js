var connection = {
    host: "localhost",
    port: 5432,
    database: "csc667",
    user: 'postgres',
    password: "6848broken"
};

var pgp =  require('pg-promise')();
var db = pgp(process.env.DATABASE_URL, (err, client => {
    if (err) throw err;
    console.log('Connected to postgres! Getting schemas...');

    client
        .query('SELECT table_schema,table_name FROM information_schema.tables;')
        .on('row', function(row) {
            console.log(JSON.stringify(row));
        });
}));

module.exports = db;

