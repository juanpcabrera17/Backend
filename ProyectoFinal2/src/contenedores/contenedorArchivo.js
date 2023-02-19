const fs = require('fs');

class contenedorArchivo {
	constructor(ruta) {
		this.ruta = ruta;
	}

	// Devuelve un array con todos los objetos presentes en el archivo

	getAll = async () => {
		try {
			const res = JSON.parse(await fs.promises.readFile(this.ruta, 'utf-8'));
			return res;
		} catch (err) {
			console.log(err);
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
			console.log(objs);
			return objs;
		} catch (err) {
			console.log(err);
		}
	};

	// Recibe un id, devuelve el objeto con ese id, o null si no lo encuentra

	getById = async (Number) => {
		try {
			let objs = await this.getAll();
			let objetoEncontrado = objs.find((item) => item.id == Number);
			if (!objetoEncontrado) {
				console.log(null);
			} else {
				let objeto = objs.filter((item) => item.id == Number);
				console.log(objeto);
				return objeto;
			}
		} catch (err) {
			console.log(err);
		}
	};

	// Elimina del archivo el objeto con el id ingresado

	deleteById = async (Number) => {
		try {
			let objs = await this.getAll();
			let objeto = objs.filter((item) => item.id != Number);
			await fs.promises.writeFile(this.ruta, JSON.stringify(objeto, null));
			console.log(`el objeto ${Number} fue eliminado`);
			return objeto;
		} catch (err) {
			console.log(err);
		}
	};

	// Elimina todos los objetos presentes en el archivo

	deleteAll = async () => {
		try {
			await fs.promises.writeFile(this.ruta, JSON.stringify([], null));
		} catch (err) {
			console.log(err);
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
				console.log(null);
			}
		} catch (err) {
			console.log(err);
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
			console.log(objs);
			return objs;
		} catch (err) {
			console.log(err);
		}
	};

	// Guarda el objeto en el carrito indicado

	saveProducto = async (Number, Object) => {
		try {
			let carrito = await this.getAll();
			let idCarrito = Number;
			const fechaActual = new Date(Date.now()).toLocaleString();
			Object.timestamp = fechaActual;
			let id = 0;
			if (carrito[idCarrito].productos.length === 0) {
				id = 0;
			} else {
				id = carrito[idCarrito].productos[carrito[idCarrito].productos.length - 1].id + 1;
			}
			Object.id = id;
			carrito[idCarrito].productos.push(Object);

			await fs.promises.writeFile(this.ruta, JSON.stringify(carrito, null));
			return carrito;
		} catch (err) {
			console.log(err);
		}
	};

	// Elimina del archivo el objeto con el id ingresado

	deleteProductById = async (Number1, Number2) => {
		try {
			let carrito = await this.getAll();
			let objeto = carrito[Number1].productos.filter((item) => item.id != Number2);
			carrito[Number1].productos = objeto;

			await fs.promises.writeFile(this.ruta, JSON.stringify(carrito, null));
			console.log(`el producto ${Number2} del carrito ${Number1} fue eliminado`);
			return objeto;
		} catch (err) {
			console.log(err);
		}
	};
}

module.exports = contenedorArchivo;