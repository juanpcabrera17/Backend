const { options } = require('../options/mysql');
const knex = require('knex')(options);

knex.schema
	.createTable('productos', (table) => {
		table.increments('id'), table.string('name'), table.float('price'), table.string('thumbnail');
	})
	.then(() => {
		console.log('Tabla productos creada correctamente');
	})
	.catch((err) => {
		console.log(err);
		throw new Error(err);
	})
	.finally(() => {
		knex.destroy();
	});

knex('productos')
	.insert([
		{
			name: 'Antena parabolica',
			price: '40000',
			thumbnail: 'https://i.ibb.co/ZSRj4nw/antena-1.png',
		},
		{
			name: 'Switch',
			price: '20000',
			thumbnail: 'https://i.ibb.co/7yfnTJD/switch-1.png',
		},
		{
			name: 'Router WiFi',
			price: '9000',
			thumbnail: 'https://i.ibb.co/TgDKLYD/router-1.png',
		},
	])
	.then(() => {
		console.log('Se insertaron los productos');
	})
	.catch((err) => {
		console.log(err);
	})
	.finally(() => {
		knex.destroy();
	});
