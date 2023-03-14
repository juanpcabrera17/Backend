const { app, contenedor, contenedorChat, PORT } = require('./config/configServer');
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const routerUsuario = require('./router/routesUsuario');
const routerProductos = require('./router/routesProductos');
const routerCarrito = require('./router/routesCarrito');
const routerRandoms = require('./router/routesRandoms');
const { loggerWarn } = require('./config/configWinston');
const productosGenerados = require('./config/configFaker');

httpServer.listen(PORT, () => {
	loggerWarn.info(`Example app listening on port http://localhost:${PORT}/api/usuario/login`);
});

//HTTP Server
app.use('/api/usuario', routerUsuario);
app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);
app.use('/api/randoms', routerRandoms);
app.get('*', (req, res) => {
	loggerWarn.warn({ metodo: req.method, path: req.path });
	res.status(404).send('error 404 not found');
});

//WebSocket
io.on('connection', async (socket) => {
	// "connection" se ejecuta la primera vez que se abre una nueva conexión
	loggerWarn.info(`se conectó el cliente: [${socket.id}]`);

	/* socket.emit('product-list', await contenedor.getAll()); */

	socket.emit('msg-list', await contenedorChat.getChat());

	socket.on('msg', async (data) => {
		loggerWarn.info('data', data);
		const fechaActual = Date.now();
		const fecha = new Date(fechaActual);
		const fechaFormat = fecha.toLocaleString();

		await contenedorChat.saveChat({ socketid: socket.id, fecha: fechaFormat, ...data });
		io.emit('msg-list', await contenedorChat.getChat());
	});

	/* socket.on('product', async (data) => {
		console.log('producto nuevo: ', data);

		await contenedor.save(data);
		io.emit('product-list', await contenedor.getAll());
	}); */

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

	socket.emit('randomProduct-list', productosGenerados());
});
