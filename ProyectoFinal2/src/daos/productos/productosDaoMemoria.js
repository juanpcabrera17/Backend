const contenedorMemoria = require('../../contenedores/contenedorMemoria');
const array = [];

class productosDaoMemoria extends contenedorMemoria {
	constructor() {
		super(array);
	}
}

module.exports = productosDaoMemoria;
