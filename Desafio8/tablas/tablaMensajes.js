const { options } = require('../options/sqlite3');
const knex = require('knex')(options);

knex.schema
	.createTable('mensajes', (table) => {
		table.increments('id'), table.string('socketid'), table.string('fecha'), table.string('email'), table.string('mensaje');
	})
	.then(() => {
		console.log('Tabla mensajes creada correctamente');
	})
	.catch((err) => {
		console.log(err);
		throw new Error(err);
	})
	.finally(() => {
		knex.destroy();
	});

knex('mensajes')
	.insert([])
	.then(() => {
		console.log('Se insertaron los mensajes');
	})
	.catch((err) => {
		console.log(err);
	})
	.finally(() => {
		knex.destroy();
	});
