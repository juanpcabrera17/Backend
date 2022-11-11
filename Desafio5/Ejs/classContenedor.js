const fs = require("fs");

let item = [];

class Contenedor {
	constructor(titulo, precio, id) {
		item = [
			{
				titulo: titulo,
				precio: precio,
				id: id,
			},
		];
	}

	// Devuelve un array con todos los objetos presentes en el archivo

	getAll = async () => {
		try {
			const productos = JSON.parse(
				await fs.promises.readFile("./productos.json")
			);
			//console.log(productos)
			return productos;
		} catch (err) {
			console.log(err);
		}
	};

	// Recibe un objeto, lo guarda en el archivo, devuelve el id asignado

	save = async (Object) => {
		try {
			let productos = await this.getAll();
			let id = 0;
			if (productos.length === 0) {
				id = 1;
			} else {
				id = productos[productos.length - 1].id + 1;
			}
			Object.id = id;
			productos = [...productos, Object];

			await fs.promises.writeFile(
				"./productos.json",
				JSON.stringify(productos, null)
			);
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
			await fs.promises.writeFile(
				"./productos.json",
				JSON.stringify(objeto, null)
			);
			console.log(`el producto ${Number} fue eliminado`);
			return objeto;
		} catch (err) {
			console.log(err);
		}
	};

	// Elimina todos los objetos presentes en el archivo

	deleteAll = async () => {
		try {
			await fs.promises.writeFile(
				"./productos.json",
				JSON.stringify([], null)
			);
		} catch (err) {
			console.log(err);
		}
	};

	findIndex = async (Number) => {
		try {
			let productos = await this.getAll();
			let indiceEncontrado = productos.findIndex(
				(item) => item.id == Number
			);
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
			console.log(Number);
			body.id = Number;
			console.log(body.id);
			productos[Number] = body;
			await fs.promises.writeFile(
				"./productos.json",
				JSON.stringify(productos, null)
			);
			console.log(productos);
			return productos;
		} catch (err) {
			console.log(err);
		}
	};
}

const contenedor = new Contenedor();

// Llamado a los diferentes metodos

//contenedor.getAll()

/* contenedor.save({
	titulo: "zanahoria",
	precio: 60,
	id: 0
}) */

//contenedor.getById(3)

//contenedor.deleteById(4)

//contenedor.deleteAll()

module.exports = Contenedor;
