const DAOproductsMongo = require('./DAOs/DAOproductsMongo');
const DAOcartMongo = require('./DAOs/DAOcartMongo');
const DAOproductsFile = require('./DAOs/DAOproductsFile');
const DAOcartFile = require('./DAOs/DAOcartFile');

let DAO;
let mode = process.argv[2];

if (mode == 'mongo') {
	DAO = {
		products: new DAOproductsMongo(),
		cart: new DAOcartMongo(),
	};
} else if (mode == 'file') {
	DAO = {
		products: new DAOproductsFile(),
		cart: new DAOcartFile(),
	};
} else {
	throw 'Indicar el tipo de persistencia en argumentos';
}

module.exports = DAO;
