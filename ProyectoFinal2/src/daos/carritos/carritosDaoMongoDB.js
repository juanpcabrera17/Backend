const connect = require('mongoose');
const { Schema, model } = require('mongoose');
const contenedorMongoDB = require('../../contenedores/contenedorMongoDB');

const carritoSchema = new Schema({
	productos: { type: Array, required: true, max: 100 },
	timestamp: { type: String, required: true, max: 100 },
	id: { type: Number, required: false, max: 100 },
});

const CarritosMongoDB = model('Carritos', carritoSchema);

const rutaConnectCarritos = 'mongodb://127.0.0.1:27017/SegundaEntregaDB';
const carritosDBMongo = 'SegundaEntregaDB';
const coleccionCarritos = 'Carritos';

class carritosDaoMongoDB extends contenedorMongoDB {
	constructor() {
		super(rutaConnectCarritos, CarritosMongoDB, carritosDBMongo, coleccionCarritos);
	}
}

module.exports = carritosDaoMongoDB;
