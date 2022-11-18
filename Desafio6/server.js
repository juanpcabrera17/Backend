//https://socket.io/docs/v4/server-initialization/
const express = require('express');
/* const Contenedor = require('./classContenedor'); */
const app = express();
const Chat = require('./chat');
/* const { engine } = require('express-handlebars'); */
const port = process.env.PORT || 8000;

//IMPLEMENTACION
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

//httpServer.listen(port, () => console.log('SERVER ON http://localhost:' + port));
httpServer.listen(port, () => {
	console.log(`Example app listening on port http://localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

/* app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
	'hbs',
	engine({
		extname: '.hbs',
		defaultLayout: 'index.hbs',
		layoutsDir: __dirname + '/views/layouts',
		partialsDir: __dirname + '/views/partials',
	})
); */

app.get('/', async (req, res) => {
	/* const contenedor = new Contenedor();
	const todos = await contenedor.getAll();
	let productsExist = true;

	if (todos.length === 0) {
		productsExist = false;
	}

	res.render('listaproductos', { title: 'Lista de productos', products: todos, productsExist: productsExist });
 */
	res.sendFile(__dirname + '/index.html');
});

let msgs = [];

io.on('connection', async (socket) => {
	// "connection" se ejecuta la primera vez que se abre una nueva conexión
	//console.log('Usuario conectado');
	msgs.push({
		socketid: socket.id,
		email: '',
		mensaje: ' se conecto: ' + socket.id,
	});
	io.sockets.emit('msg-list', msgs);

	socket.on('msg', async (data) => {
		console.log('data', data);
		const chat = new Chat();
		const fechaActual = Date.now();
		const fecha = new Date(fechaActual);
		const fechaFormat = fecha.toLocaleString();
		io.sockets.emit('msg-list', msgs);
		msgs.push({
			socketid: socket.id,
			email: data.email,
			mensaje: data.mensaje,
			fecha: fechaFormat,
		});
		// persistir con fs?
		chat.saveChat(msgs);
	});
	// Se imprimirá solo la primera vez que se ha abierto la conexión
	socket.emit('msg', 'hola front');
});
