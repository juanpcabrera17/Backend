const { connect, connection } = require('mongoose');
const { Schema, model } = require('mongoose');

class contenedorMongoDB {
	constructor(connectRoute, schema, db, collection) {
		(this.connectRoute = connectRoute), (this.schema = schema), (this.db = db), (this.collection = collection);
	}

	// Establece la conección con MongoDB

	connection = async () => {
		try {
			await connect(this.connectRoute, { useNewUrlParser: true });
			console.log('conectado: MongoDB');
		} catch (err) {
			console.log(err);
			throw 'cannot connect to the db';
		}
	};

	// Devuelve todos los objetos presentes en la base de datos

	getAll = async () => {
		try {
			const res = await this.schema.find({});
			console.log(res);
			return res;
		} catch (err) {
			console.log(err);
		}
	};

	// Guarda el objeto ingresado en la base de datos

	save = async (Object) => {
		try {
			const fechaActual = new Date(Date.now()).toLocaleString();
			Object.timestamp = fechaActual;

			const insertObject = new this.schema({ ...Object });
			const savedObject = await insertObject.save();
			console.log(savedObject);
			return savedObject;
		} catch (err) {
			console.log(err);
		}
	};

	// Recibe un id, devuelve el objeto con ese id, o null si no esta

	getById = async (Number) => {
		try {
			const obj = await this.schema.find({ _id: Number }).limit(1);
			console.log(obj);
			return obj;
		} catch (err) {
			console.log(err);
		}
	};

	// Elimina del archivo el objeto con el id ingresado

	deleteById = async (Number) => {
		try {
			const obj = await this.schema.deleteOne({ _id: Number });
			console.log(obj);
			return obj;
		} catch (err) {
			console.log(err);
		}
	};

	// Elimina todos los objetos presentes en el archivo

	deleteAll = async () => {
		try {
			await this.collection.deleteAll({});
			console.log('todos los objetos fueron eliminados');
		} catch (err) {
			console.log(err);
		}
	};

	// Devuelve el índice del producto indicado

	findIndex = async (Number) => {
		try {
			return Number;
		} catch (err) {
			console.log(err);
		}
	};

	// Reemplaza el objeto con el id ingresado

	replace = async (Number, Body) => {
		try {
			const fechaActual = new Date(Date.now()).toLocaleString();
			Body.timestamp = fechaActual;
			await this.schema.updateOne({ _id: Number }, { $set: Body });

			const newObj = await this.schema.find({ _id: Number }).limit(1);
			console.log(newObj);
			return newObj;
		} catch (err) {
			console.log(err);
		}
	};

	// Guarda el objeto en el carrito indicado

	saveProducto = async (Number, Body) => {
		try {
			const fechaActual = new Date(Date.now()).toLocaleString();
			Body.timestamp = fechaActual;
			await this.schema.updateOne({ _id: Number }, { $push: { productos: Body } });

			const newObj = await this.schema.find({ _id: Number.productos }).limit(1);
			console.log(newObj);
			return newObj;
		} catch (err) {
			console.log(err);
		}
	};

	// Elimina el objeto con el id ingresado

	deleteProductById = async (Number1, Number2) => {
		try {
			const Id = parseInt(Number2);
			await this.schema.updateOne({ _id: Number1 }, { $pull: { productos: { id: Id } } });

			console.log(`el producto ${Number2} del carrito ${Number1} fue eliminado`);
			const newObj = await this.schema.find({ _id: Number1 });
			return newObj;
		} catch (err) {
			console.log(err);
		}
	};
}

module.exports = contenedorMongoDB;
