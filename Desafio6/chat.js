const fs = require('fs');

class Chat {
	constructor() {
		this.filePath = './chat.json';
	}

	getChat = async () => {
		try {
			const chat = JSON.parse(await fs.promises.readFile('./chat.json'));
			//console.log(productos)
			return chat;
		} catch (err) {
			console.log(err);
		}
	};

	saveChat = async (Object) => {
		let chat = await this.getChat();
		/* let id = 0;
		if (productos.length === 0) {
			id = 1;
		} else {
			id = productos[productos.length - 1].id + 1;
		}
		Object.id = id; */
		try {
			chat = [...chat, Object];

			await fs.promises.writeFile('./chat.json', JSON.stringify(chat, null));
			console.log(chat);
			return chat;
		} catch (err) {
			console.log(err);
		}
	};
}

module.exports = Chat;
