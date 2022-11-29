const fs = require('fs');

class Contenedor {
	// Devuelve un array con todos los objetos presentes en el archivo

	getAll = async () => {
		try {
			const carrito = JSON.parse(await fs.promises.readFile('./carrito.json'));
			return carrito;
		} catch (err) {
			console.log(err);
		}
	};

	// Recibe un objeto, lo guarda en el archivo, devuelve el id asignado

	saveCarrito = async (Object) => {
		try {
			let carrito = await this.getAll();
			const fechaActual = new Date(Date.now()).toLocaleString();
			Object.timestamp = fechaActual;
			let id = 0;
			if (carrito.length === 0) {
				id = 0;
			} else {
				id = carrito[carrito.length - 1].id + 1;
			}
			Object.id = id;
			console.log(carrito.length);
			carrito = [...carrito, Object];

			await fs.promises.writeFile('./carrito.json', JSON.stringify(carrito, null));
			return carrito;
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
			let carrito = await this.getAll();
			let objeto = carrito.filter((item) => item.id != Number);

			await fs.promises.writeFile('./carrito.json', JSON.stringify(objeto, null));
			console.log(`el carrito ${Number} fue eliminado`);
			return objeto;
		} catch (err) {
			console.log(err);
		}
	};

	// Reemplaza el objeto con el id buscado

	replace = async (Number, body) => {
		try {
			let productos = await this.getAll();
			const fechaActual = new Date(Date.now()).toLocaleString();
			body.timestamp = fechaActual;
			body.id = Number;
			//console.log(body);
			productos[Number] = body;
			productos = [...productos, Object];

			await fs.promises.writeFile('./productos.json', JSON.stringify(productos, null));
			console.log(productos);
			return productos;
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

			await fs.promises.writeFile('./carrito.json', JSON.stringify(carrito, null));
			return carrito;
		} catch (err) {
			console.log(err);
		}
	};

	// Elimina del archivo el objeto con el id buscado

	deleteProductById = async (Number1, Number2) => {
		try {
			let carrito = await this.getAll();
			let objeto = carrito[Number1].productos.filter((item) => item.id != Number2);
			carrito[Number1].productos = objeto;

			await fs.promises.writeFile('./carrito.json', JSON.stringify(carrito, null));
			console.log(`el producto ${Number2} del carrito ${Number1} fue eliminado`);
			return objeto;
		} catch (err) {
			console.log(err);
		}
	};
}

module.exports = Contenedor;
