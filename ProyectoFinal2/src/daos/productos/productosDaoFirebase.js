const contenedorFirebase = require('../../contenedores/contenedorFirebase');

const serviceAccount = require('../../../privi.json');
const coleccionProductos = 'productos';

class productosDaoFirebase extends contenedorFirebase {
	constructor() {
		super(serviceAccount, coleccionProductos);
	}
}

module.exports = productosDaoFirebase;
