var pgp = require('pg-promise')();

module.exports = (file) = > {
	return new pgp.QueryFile(file,{minify:true});
}