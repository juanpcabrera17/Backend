const contenedorArchivo = require('../../contenedores/contenedorArchivo');

class productosDaoArchivo extends contenedorArchivo {
	constructor() {
		super('src/DB/productos.json');
	}
}

module.exports = productosDaoArchivo;
