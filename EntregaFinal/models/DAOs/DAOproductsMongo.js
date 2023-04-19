const { Schema, model } = require('mongoose');
const { loggerError } = require('../../config/configWinston');

const productsSchema = new Schema({
	id: { type: Number, required: true },
	name: { type: String, required: true },
	price: { type: Number, required: true },
	thumbnail: { type: String, required: true },
	category: { type: String, required: true },
});

const productsMongoDB = model('productos', productsSchema);

class productsContainer {
	constructor() {
		if (productsContainer._instance) {
			return productsContainer._instance;
		}
		productsContainer._instance = this;
		this.productsMongoDB = productsMongoDB;
	}

	getAll = async () => {
		try {
			const res = await this.productsMongoDB.find({}).lean();
			return res;
		} catch (err) {
			loggerError.error(`error: ${err}`);
		}
	};

	save = async (Object) => {
		try {
			const insertObject = new this.productsMongoDB({ ...Object });
			const savedObject = await insertObject.save();
			return savedObject;
		} catch (err) {
			loggerError.error(`error: ${err}`);
		}
	};

	getById = async (Number) => {
		try {
			const products = await this.productsMongoDB.find({ id: Number });
			if (products.length > 0) {
				return products;
			}
		} catch (err) {
			loggerError.error(`error: ${err}`);
		}
	};

	getByCategory = async (category) => {
		try {
			let products = await this.getAll();
			return products.filter((products) => products.category === category);
		} catch (err) {
			loggerError.error(`error: ${err}`);
		}
	};
}

module.exports = productsContainer;
