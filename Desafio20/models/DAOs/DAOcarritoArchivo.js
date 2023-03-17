const fs = require('fs');
const { loggerError, loggerWarn } = require('../../config/configWinston');

class contenedorArchivo {
	constructor() {
		if (contenedorArchivo._instance) {
			return contenedorArchivo._instance;
		}
		contenedorArchivo._instance = this;
		this.ruta = './database/carrito.json';
	}

	// Devuelve un array con todos los objetos presentes en el archivo

	getAll = async () => {
		try {
			const res = JSON.parse(await fs.promises.readFile(this.ruta, 'utf-8'));
			return res;
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Recibe un objeto, lo guarda en el archivo, devuelve el id asignado

	save = async (Object) => {
		try {
			let objs = await this.getAll();
			const fechaActual = new Date(Date.now()).toLocaleString();
			Object.timestamp = fechaActual;
			let id = 0;
			if (objs.length === 0) {
				id = 0;
			} else {
				id = objs[objs.length - 1].id + 1;
			}
			Object.id = id;
			objs = [...objs, Object];

			await fs.promises.writeFile(this.ruta, JSON.stringify(objs, null));
			loggerWarn.info(objs);
			return objs;
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Recibe un id, devuelve el objeto con ese id, o null si no lo encuentra

	getById = async (username) => {
		try {
			let objs = await this.getAll();
			let objetoEncontrado = objs.find((item) => item.id == username);
			if (!objetoEncontrado) {
				loggerWarn.info(null);
			} else {
				let objeto = objs.filter((item) => item.id == username);
				loggerWarn.info(objeto);
				return objeto;
			}
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Elimina del archivo el objeto con el id ingresado

	deleteById = async (Number) => {
		try {
			let objs = await this.getAll();
			let objeto = objs.filter((item) => item.id != Number);
			await fs.promises.writeFile(this.ruta, JSON.stringify(objeto, null));
			loggerWarn.info(`el objeto ${Number} fue eliminado`);
			return objeto;
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Elimina todos los objetos presentes en el archivo

	deleteAll = async () => {
		try {
			await fs.promises.writeFile(this.ruta, JSON.stringify([], null));
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Devuelve el índice del producto indicado

	findIndex = async (Number) => {
		try {
			let productos = await this.getAll();
			let indiceEncontrado = productos.findIndex((item) => item.id == Number);
			if (indiceEncontrado >= 0) {
				return indiceEncontrado;
			} else {
				loggerWarn.info(null);
			}
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Reemplaza el objeto con el id ingresado

	replace = async (Number, body) => {
		try {
			let objs = await this.getAll();
			const fechaActual = new Date(Date.now()).toLocaleString();
			body.timestamp = fechaActual;
			body.id = Number;
			objs[Number] = body;

			await fs.promises.writeFile(this.ruta, JSON.stringify(objs, null));
			loggerWarn.info(objs);
			return objs;
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Guarda el objeto en el carrito indicado

	saveProducto = async (username, Object) => {
		try {
			let carrito = await this.getAll();
			let carritoActual = await this.getById(username);

			const fechaActual = new Date(Date.now()).toLocaleString();
			Object.timestamp = fechaActual;
			let id = 0;
			if (carritoActual) {
				if (carritoActual[0].productos.length === 0) {
					id = 0;
				} else {
					id = carritoActual[0].productos.length;
				}
				Object.id = id;
				carritoActual[0].productos.push(Object);
				const carritoViejo = carrito.filter((obj) => obj.id !== username);
				carrito = [...carritoViejo, ...carritoActual];
			} else {
				let carritoNuevo = [
					{
						productos: [],
						timestamp: fechaActual,
						id: username,
					},
				];
				Object.id = 0;
				carritoNuevo[0].productos.push(Object);
				loggerWarn.info(carrito);
				if (JSON.stringify(carrito) == '[]') {
					carrito = carritoNuevo;
					loggerWarn.info('entro aca');
				} else {
					carrito.push(carritoNuevo);
				}
			}
			await fs.promises.writeFile(this.ruta, JSON.stringify(carrito, null));
			return carrito;
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Elimina del archivo el objeto con el id ingresado

	deleteProductById = async (Number1, Number2) => {
		try {
			let carrito = await this.getAll();
			let objeto = carrito[Number1].productos.filter((item) => item.id != Number2);
			carrito[Number1].productos = objeto;

			await fs.promises.writeFile(this.ruta, JSON.stringify(carrito, null));
			loggerWarn.info(`el producto ${Number2} del carrito ${Number1} fue eliminado`);
			return objeto;
		} catch (err) {
			loggerError.error(err);
		}
	};
}

module.exports = contenedorArchivo;
