const express = require('express');
const app = express();
const Contenedor = require('./classContenedor');
const contenedor = new Contenedor();
const Chat = require('./chat');
const chat = new Chat();
const PORT = process.env.PORT || 8000;

//IMPLEMENTACION
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

httpServer.listen(PORT, () => {
	console.log(`Example app listening on port http://localhost:${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', async (socket) => {
	// "connection" se ejecuta la primera vez que se abre una nueva conexión
	console.log(`se conectó el cliente: [${socket.id}]`);

	socket.emit('product-list', await contenedor.getAll());

	socket.emit('msg-list', await chat.getChat());

	socket.on('msg', async (data) => {
		console.log('data', data);
		const fechaActual = Date.now();
		const fecha = new Date(fechaActual);
		const fechaFormat = fecha.toLocaleString();

		await chat.saveChat({ socketid: socket.id, fecha: fechaFormat, ...data });
		io.emit('msg-list', await chat.getChat());
	});

	socket.on('product', async (data) => {
		console.log('producto nuevo: ', data);

		await contenedor.save(data);
		io.emit('product-list', await contenedor.getAll());
	});

	socket.on('id', async (number) => {
		await contenedor.getById(number);
	});

	socket.on('deleteId', async (number) => {
		await contenedor.deleteById(number);
	});

	socket.on('deleteAll', async () => {
		await contenedor.deleteAll();
	});

	socket.on('replace', async (number, body) => {
		await contenedor.replace(number, body);
	});
});
