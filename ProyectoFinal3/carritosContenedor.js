const { Schema, model } = require('mongoose');
const { loggerWarn } = require('./winston');

const carritosSchema = new Schema({
	id: { type: String, required: true },
	productos: [
		{
			productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
			name: { type: String, required: true },
			price: { type: Number, required: true },
			thumbnail: { type: String, required: true },
			quantity: { type: Number, required: true },
		},
	],
	timestamp: { type: String, required: true },
});

const carritosMongoDB = model('Carritos', carritosSchema);

class carritosContenedor {
	constructor() {
		this.carritosMongoDB = carritosMongoDB;
	}
	// Devuelve un array con todos los objetos presentes en el archivo

	// Devuelve todos los objetos presentes en la base de datos

	getAll = async () => {
		try {
			const res = await this.carritosMongoDB.find({});
			loggerWarn.info(res);
			return res;
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Guarda el objeto ingresado en la base de datos

	save = async (Object) => {
		try {
			const fechaActual = new Date(Date.now()).toLocaleString();
			Object.timestamp = fechaActual;

			const insertObject = new this.schema({ ...Object });
			const savedObject = await insertObject.save();
			loggerWarn.info(savedObject);
			return savedObject;
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Recibe un id, devuelve el objeto con ese id, o null si no esta

	getById = async (username) => {
		try {
			const obj = await this.carritosMongoDB.find({ id: username }).lean();
			return obj;
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Elimina del archivo el objeto con el id ingresado

	deleteById = async (Number) => {
		try {
			const obj = await this.schema.deleteOne({ _id: Number });
			loggerWarn.info(obj);
			return obj;
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Elimina todos los objetos presentes en el archivo

	deleteAll = async () => {
		try {
			await this.collection.deleteAll({});
			loggerWarn.info('todos los objetos fueron eliminados');
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Devuelve el índice del producto indicado

	findIndex = async (Number) => {
		try {
			return Number;
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Reemplaza el objeto con el id ingresado

	replace = async (Number, Body) => {
		try {
			const fechaActual = new Date(Date.now()).toLocaleString();
			Body.timestamp = fechaActual;
			await this.schema.updateOne({ _id: Number }, { $set: Body });

			const newObj = await this.schema.find({ _id: Number }).limit(1);
			loggerWarn.info(newObj);
			return newObj;
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Guarda el objeto en el carrito indicado

	saveProducto = async (username, Body) => {
		try {
			const fechaActual = new Date(Date.now()).toLocaleString();

			const cart = await this.carritosMongoDB.findOne({ id: username });
			const idProducto = Body.productId;
			const nameProducto = Body.name;
			const priceProducto = parseInt(Body.price);
			const thumbnailProducto = Body.thumbnail;
			const quantity = parseInt(Body.quantity);

			if (!cart) {
				const newCart = new this.carritosMongoDB({
					id: username,
					productos: [
						{
							productId: idProducto,
							name: nameProducto,
							price: priceProducto,
							thumbnail: thumbnailProducto,
							quantity,
						},
					],
					timestamp: fechaActual,
				});
				return await newCart.save();
			} else {
				const existingItem = cart.productos.find((productos) =>
					productos.productId.equals(idProducto)
				);
				if (existingItem) {
					existingItem.quantity += quantity;
				} else {
					cart.productos.push({
						productId: idProducto,
						name: nameProducto,
						price: priceProducto,
						thumbnail: thumbnailProducto,
						quantity,
					});
				}
				return await cart.save();
			}
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Elimina el objeto con el id ingresado

	deleteProductById = async (Number1, Number2) => {
		try {
			const Id = parseInt(Number2);
			await this.schema.updateOne({ _id: Number1 }, { $pull: { productos: { id: Id } } });

			loggerWarn.info(`el producto ${Number2} del carrito ${Number1} fue eliminado`);
			const newObj = await this.schema.find({ _id: Number1 });
			return newObj;
		} catch (err) {
			loggerError.error(err);
		}
	};
}

module.exports = carritosContenedor;
