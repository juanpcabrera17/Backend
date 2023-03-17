const DAOproductsMongo = require('./DAOs/DAOproductsMongo');
const DAOcarritoMongo = require('./DAOs/DAOcarritoMongo');
const DAOproductsArchivo = require('./DAOs/DAOproductsArchivo');
const DAOcarritoArchivo = require('./DAOs/DAOcarritoArchivo');

let DAO;
let modo = process.argv[2];

if (modo == 'mongo') {
	DAO = {
		productos: new DAOproductsMongo(),
		carrito: new DAOcarritoMongo(),
	};
} else if (modo == 'archivo') {
	DAO = {
		productos: new DAOproductsArchivo(),
		carrito: new DAOcarritoArchivo(),
	};
} else if (modo == 'pruebasingleton') {
	DAO = {
		productos: new DAOproductsMongo(),
		carrito: new DAOcarritoMongo(),
		productos2: new DAOproductsMongo(),
		carrito2: new DAOcarritoMongo(),
	};
	console.log(DAO.productos === DAO.productos2);
	console.log(DAO.carrito === DAO.carrito2);
} else {
	throw 'Indicar el tipo de persistencia en argumentos';
}

module.exports = DAO;
