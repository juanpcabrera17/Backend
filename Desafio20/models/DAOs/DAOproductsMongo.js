const { Schema, model } = require('mongoose');
const { loggerError } = require('../../config/configWinston');

const productosSchema = new Schema({
	id: { type: Number, required: true },
	name: { type: String, required: true },
	price: { type: Number, required: true },
	thumbnail: { type: String, required: true },
	category: { type: String, required: true },
});

const productosMongoDB = model('Productos', productosSchema);

// CONTENEDOR

class productsContenedor {
	constructor() {
		if (productsContenedor._instance) {
			return productsContenedor._instance;
		}
		productsContenedor._instance = this;
		this.productosMongoDB = productosMongoDB;
	}

	// Devuelve un array con todos los objetos presentes en el archivo

	getAll = async () => {
		try {
			const res = await this.productosMongoDB.find({}).lean();
			return res;
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Recibe un objeto, lo guarda en el archivo, devuelve el id asignado

	save = async (Object) => {
		try {
			const insertObject = new this.productosMongoDB({ ...Object });
			const savedObject = await insertObject.save();
			loggerWarn.info(savedObject);
			return savedObject;
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Recibe un id, devuelve el objeto con ese id, o null si no esta

	getById = async (Number) => {
		try {
			const productos = await this.productosMongoDB.find({ id: Number });
			if (productos.length > 0) {
				loggerWarn.info(productos);
				return productos;
			}
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Elimina del archivo el objeto con el id buscado

	deleteById = async (Number) => {
		try {
			const producto = db.movies.deleteOne({ number: Number });
			if (producto) {
				loggerWarn.info('producto eliminado');
			}
		} catch (err) {
			loggerError.error(err);
		}
	};

	getByCategory = async (category) => {
		try {
			let productos = await this.getAll();
			return productos.filter((productos) => productos.category === category);
		} catch (err) {
			loggerError.error(err);
		}
	};
}

module.exports = productsContenedor;