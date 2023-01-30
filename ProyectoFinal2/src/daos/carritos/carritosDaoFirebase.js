const contenedorFirebase = require('../../contenedores/contenedorFirebase');

const serviceAccount = require('../../../privi.json');
const coleccionCarritos = 'carritos';

class carritosDaoFirebase extends contenedorFirebase {
	constructor() {
		super(serviceAccount, coleccionCarritos);
	}
}

module.exports = carritosDaoFirebase;
