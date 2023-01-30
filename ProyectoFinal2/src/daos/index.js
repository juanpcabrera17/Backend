const carritosDaoArchivo = require('./carritos/carritosDaoArchivo');
const productosDaoArchivo = require('./productos/productosDaoArchivo');
const productosDaoMemoria = require('./productos/productosDaoMemoria');
const carritosDaoMemoria = require('./carritos/carritosDaoMemoria');
const productosDaoMongoDB = require('./productos/productosDaoMongoDB');
const carritosDaoMongoDB = require('./carritos/carritosDaoMongoDB');
const productosDaoFirebase = require('./productos/productosDaoFirebase');
const carritosDaoFirebase = require('./carritos/carritosDaoFirebase');

require('dotenv').config();

const instancias = [
	{
		nombre: productosDaoArchivo,
		id: 'archivo',
		descripcion: 'producto',
	},
	{
		nombre: carritosDaoArchivo,
		id: 'archivo',
		descripcion: 'carrito',
	},
	{
		nombre: productosDaoMemoria,
		id: 'memoria',
		descripcion: 'producto',
	},
	{
		nombre: carritosDaoMemoria,
		id: 'memoria',
		descripcion: 'carrito',
	},
	{
		nombre: productosDaoMongoDB,
		id: 'MongoDB',
		descripcion: 'producto',
	},
	{
		nombre: carritosDaoMongoDB,
		id: 'MongoDB',
		descripcion: 'carrito',
	},
	{
		nombre: productosDaoFirebase,
		id: 'Firebase',
		descripcion: 'producto',
	},
	{
		nombre: carritosDaoFirebase,
		id: 'Firebase',
		descripcion: 'carrito',
	},
];

const instancia = instancias.filter((i) => i.id == process.env.INSTANCIA);

const resultado = {
	[instancia[0].descripcion]: instancia[0].nombre,
	[instancia[1].descripcion]: instancia[1].nombre,
};

module.exports = resultado;
