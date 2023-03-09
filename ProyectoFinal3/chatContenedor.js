const { connect, connection } = require('mongoose');
const { Schema, model } = require('mongoose');
const normalizr = require('./normalizr');
const { loggerError, loggerWarn } = require('./winston');

const chatSchema = new Schema({
	socketid: { type: String, required: true, max: 100 },
	fecha: { type: String, required: true, max: 100 },
	author: {
		idEmail: { type: String, required: true, max: 100 },
		nombre: { type: String, required: true, max: 100 },
		apellido: { type: String, required: true, max: 100 },
		edad: { type: Number, required: true, max: 100 },
		alias: { type: String, required: true, max: 100 },
		avatar: { type: String, required: true },
	},
	text: { type: String, required: true },
});

const chatMongoDB = model('Chat', chatSchema);

class chatContenedor {
	constructor() {
		this.chatMongoDB = chatMongoDB;
	}

	// Devuelve todos los objetos presentes en la base de datos

	getChat = async () => {
		try {
			const res = await this.chatMongoDB.find({});
			/* console.log('sin normalizar: ' + res); */
			const normalizado = normalizr.normalizeChat(res);
			/* console.log(JSON.stringify(normalizado)); */
			return normalizado;
		} catch (err) {
			loggerError.error(err);
		}
	};

	// Guarda el objeto ingresado en la base de datos

	saveChat = async (Object) => {
		try {
			const insertObject = new this.chatMongoDB({ ...Object });
			const savedObject = await insertObject.save();
			loggerWarn.info(savedObject);
			return savedObject;
		} catch (err) {
			loggerError.error(err);
		}
	};
}

module.exports = chatContenedor;
