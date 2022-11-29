const fs = require('fs');

class Contenedor {
	// Devuelve un array con todos los objetos presentes en el archivo

	getAll = async () => {
		try {
			const productos = JSON.parse(await fs.promises.readFile('./productos.json'));
			return productos;
		} catch (err) {
			console.log(err);
		}
	};

	// Recibe un objeto, lo guarda en el archivo, devuelve el id asignado

	save = async (Object) => {
		try {
			let productos = await this.getAll();
			const fechaActual = new Date(Date.now()).toLocaleString();
			Object.timestamp = fechaActual;
			let id = 0;
			if (productos.length === 0) {
				id = 0;
			} else {
				id = productos[productos.length - 1].id + 1;
			}
			Object.id = id;
			productos = [...productos, Object];

			await fs.promises.writeFile('./productos.json', JSON.stringify(productos, null));
			console.log(productos);
			return productos;
		} catch (err) {
			console.log(err);
		}
	};

	// Recibe un id, devuelve el objeto con ese id, o null si no esta

	getById = async (Number) => {
		try {
			let productos = await this.getAll();
			let objetoEncontrado = productos.find((item) => item.id == Number);
			if (!objetoEncontrado) {
				console.log(null);
			} else {
				let objeto = productos.filter((item) => item.id == Number);
				console.log(objeto);
				return objeto;
			}
		} catch (err) {
			console.log(err);
		}
	};

	// Elimina del archivo el objeto con el id buscado

	deleteById = async (Number) => {
		try {
			let productos = await this.getAll();
			let objeto = productos.filter((item) => item.id != Number);
			await fs.promises.writeFile('./productos.json', JSON.stringify(objeto, null));
			console.log(`el producto ${Number} fue eliminado`);
			return objeto;
		} catch (err) {
			console.log(err);
		}
	};

	// Elimina todos los objetos presentes en el archivo

	deleteAll = async () => {
		try {
			await fs.promises.writeFile('./productos.json', JSON.stringify([], null));
		} catch (err) {
			console.log(err);
		}
	};

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

	replace = async (Number, body) => {
		try {
			let productos = await this.getAll();
			const fechaActual = new Date(Date.now()).toLocaleString();
			body.timestamp = fechaActual;
			body.id = Number;
			productos[Number] = body;

			await fs.promises.writeFile('./productos.json', JSON.stringify(productos, null));
			console.log(productos);
			return productos;
		} catch (err) {
			console.log(err);
		}
	};
}

module.exports = Contenedor;
