const contenedorArchivo = require('../../contenedores/contenedorArchivo');

class carritosDaoArchivo extends contenedorArchivo {
	constructor() {
		super('src/DB/carrito.json');
	}
}

module.exports = carritosDaoArchivo;
