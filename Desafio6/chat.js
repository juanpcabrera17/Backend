const fs = require('fs');

class Chat {
	constructor() {
		this.filePath = './chat.json';
	}

	getChat = async () => {
		try {
			const chat = JSON.parse(await fs.promises.readFile('./chat.json'));
			return chat;
		} catch (err) {
			console.log(err);
		}
	};

	saveChat = async (Object) => {
		let chat = await this.getChat();

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
