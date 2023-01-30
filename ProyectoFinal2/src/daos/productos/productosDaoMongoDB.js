const connect = require('mongoose');
const { Schema, model } = require('mongoose');
const contenedorMongoDB = require('../../contenedores/contenedorMongoDB');

const productoSchema = new Schema({
	nombre: { type: String, required: true, max: 100 },
	descripcion: { type: String, required: true },
	codigo: { type: String, required: true, max: 100 },
	'foto(url)': { type: String, required: true, max: 1000 },
	precio: { type: Number, required: true },
	stock: { type: Number, required: true, max: 1000 },
	timestamp: { type: String, required: true, max: 100 },
	id: { type: Number, required: false, max: 100 },
});

const ProductosMongoDB = model('Productos', productoSchema);

const rutaConnectProductos = 'mongodb+srv://juanpablocabrera:SmfEBtvKEIkQTQWd@telco-store.9oxj1vh.mongodb.net/?retryWrites=true&w=majority';
const productosDBMongo = 'SegundaEntregaDB';
const coleccionProductos = 'Productos';

class productosDaoMongoDB extends contenedorMongoDB {
	constructor() {
		super(rutaConnectProductos, ProductosMongoDB, productosDBMongo, coleccionProductos);
	}
}

module.exports = productosDaoMongoDB;
