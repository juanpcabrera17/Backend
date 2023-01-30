const contenedorMemoria = require('../../contenedores/contenedorMemoria');
const array = [];

class carritosDaoMemoria extends contenedorMemoria {
	constructor() {
		super(array);
	}
}

module.exports = carritosDaoMemoria;
