const { options } = require('./options/sqlite3');
const knex = require('knex')(options);

class Chat {
	constructor(table) {
		this.table = table;
	}

	getChat = async () => {
		try {
			const chat = await knex.from('mensajes').select('*');
			if (chat.length > 0) {
				console.log(chat);
				return chat;
			} else {
				return [];
			}
		} catch (err) {
			console.log(err);
		}
	};

	saveChat = async (Object) => {
		try {
			await knex.from('mensajes').insert(Object);
			console.log('mensaje insertado', Object);
		} catch (err) {
			console.log(err);
		}
	};
}

module.exports = Chat;
