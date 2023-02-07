const normalizr = require('normalizr');
const schema = normalizr.schema;
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;

const originalData = {
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
};

const authorSchema = new schema.Entity('authors', {}, { idAttribute: 'idEmail' });
const messageSchema = new schema.Entity(
	'messages',
	{
		author: authorSchema,
	},
	{ idAttribute: '_id' }
);
const messageList = [messageSchema];

const normalizeChat = (chat) => {
	const chatToNormalize = chat.map((msg) => ({
		socketid: msg.socketid,
		fecha: msg.fecha,
		author: msg.author,
		text: msg.text,
		_id: msg['_id'],
		__v: msg['__v'],
	}));
	console.log('chat a normalizar: ' + JSON.stringify(chatToNormalize));
	const normalized = normalize(chatToNormalize, messageList);
	return normalized;
};

module.exports = { normalizeChat };

/* console.log(JSON.stringify(originalData));
const dataNormalized = normalize(originalData, posts);

console.log(JSON.stringify(dataNormalized)); */
