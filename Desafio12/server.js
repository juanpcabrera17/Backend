const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { Router } = express;
const app = express();
const routerProductos = Router();
const Contenedor = require('./classContenedor');
const contenedor = new Contenedor();
const Chat = require('./chatContenedor');
const chat = new Chat();
const PORT = process.env.PORT || 8000;

const productosGenerados = require('./faker');

//IMPLEMENTACION
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

app.use(
	session({
		store: MongoStore.create({
			mongoUrl: 'mongodb+srv://juanpablocabrera:XapSUXFrNaOVvMuP@cluster0.wo1uctf.mongodb.net/?retryWrites=true&w=majority',
			mongoOptions: {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
			ttl: 60,
			cookie: {
				maxAge: 600000,
			},
		}),
		secret: 'secreto',
		resave: false,
		saveUninitialized: false,
	})
);

httpServer.listen(PORT, () => {
	console.log(`Example app listening on port http://localhost:${PORT}`);
});

app.use('/public', express.static(__dirname + '/public', { index: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', routerProductos);

routerProductos.get('/login', async (req, res) => {
	/* res.sendFile(__dirname + '/public/login/login.html'); */
	const { username, password } = req.query;
	if (username !== 'juanpablo' || password !== 'juanpablopass') {
		return res.sendFile(__dirname + '/public/login.html');
	}
	req.session.user = username;
	req.session.admin = true;
	res.redirect('/public/?username=juanpablo');
});

const auth = (req, res, next) => {
	console.log('entre a auth');
	if (req.session && req.session.user === 'juanpablo' && req.session.admin) {
		const user = req.session.user;
		module.exports = user;
		return next();
	} else {
		res.status(401).redirect('/public/login');
	}
};

routerProductos.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			res.send('no pudo deslogear');
		} else {
			res.sendFile(__dirname + '/public/logout.html');
		}
	});
});

routerProductos.get('/', auth, async (req, res) => {
	console.log('no se q ' + req.session.cookie.maxAge);
	res.sendFile(__dirname + '/public/index.html');
});

routerProductos.get('/productos-test', auth, async (req, res) => {
	res.sendFile(__dirname + '/public/productosAzar/productosAzar.html');
});

io.on('connection', async (socket) => {
	// "connection" se ejecuta la primera vez que se abre una nueva conexión
	console.log(`se conectó el cliente: [${socket.id}]`);

	socket.emit('product-list', await contenedor.getAll());

	await chat.connection();
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

	socket.emit('randomProduct-list', productosGenerados());
});
