const express = require('express');
const app = express();
const { Router } = express;
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const routerProductos = Router();
const Contenedor = require('./classContenedor');
const contenedor = new Contenedor();
const Chat = require('./chatContenedor');
const chat = new Chat();
const PORT = process.env.PORT || 8000;

const Usuarios = require('./usersModel');
const bcrypt = require('bcrypt');

const productosGenerados = require('./faker');

//IMPLEMENTACION
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

mongoose
	.connect('mongodb+srv://juanpablocabrera:OoXG4Lns64acZsFs@cluster0.sail1ko.mongodb.net/?retryWrites=true&w=majority')
	.then(() => console.log('Connected to Mongo'))
	.catch((e) => {
		console.error(e);
		throw 'can not connect to the mongo!';
	});

const isValidPassword = (user, password) => {
	return bcrypt.compareSync(password, user.password);
};

const createHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

const usuarios = [];

passport.use(
	'login',
	new LocalStrategy((username, password, done) => {
		Usuarios.findOne({ username }, (err, user) => {
			if (err) return done(err);

			if (!user) {
				console.log('Ningun usuario encontrado con el nombre ' + username);
				return done(null, false);
			}

			if (!isValidPassword(user, password)) {
				console.log('Contraseña invalida');
				return done(null, false);
			}

			return done(null, user);
		});
	})
);

passport.use(
	'signup',
	new LocalStrategy(
		{
			passReqToCallback: true,
		},
		(req, username, password, done) => {
			Usuarios.findOne({ username: username }, function (err, user) {
				if (err) {
					console.log('Error en el signup: ' + err);
					return done(err);
				}

				if (user) {
					console.log('El usuario ya existe');
					return done(null, false);
				}

				const newUser = {
					username: username,
					password: createHash(password),
				};
				Usuarios.create(newUser, (err, userWithId) => {
					if (err) {
						console.log('Error guardando el usuario: ' + err);
						return done(err);
					}
					console.log(user);
					console.log('El usuario fue registrado con exito');
					return done(null, userWithId);
				});
			});
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	Usuarios.findById(id, done);
});

app.use(
	session({
		store: MongoStore.create({
			mongoUrl: 'mongodb+srv://juanpablocabrera:OoXG4Lns64acZsFs@cluster0.sail1ko.mongodb.net/?retryWrites=true&w=majority',
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
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', routerProductos);

routerProductos.get('/login', async (req, res) => {
	if (req.isAuthenticated()) {
		const { username, password } = req.user;
		const user = { username, password };
		res.redirect('/public/') /* .then(res.send({user})) */;
	} else {
		return res.sendFile(__dirname + '/public/login.html');
	}
});

routerProductos.post('/login', passport.authenticate('login', { failureRedirect: '/public/faillogin' }), (req, res) => {
	const { username, password } = req.user;
	const user = { username, password };
	console.log(user);
	res.redirect(302, '/public/');
});

routerProductos.get('/faillogin', async (req, res) => {
	res.sendFile(__dirname + '/public/faillogin.html');
});

routerProductos.get('/signup', (req, res) => {
	if (req.isAuthenticated()) {
		const { username, password } = req.user;
		const user = { username, password };
		res.redirect('/public/'); /* .then(res.send({user})) */
	} else {
		res.sendFile(__dirname + '/public/signup.html');
	}
});

routerProductos.post('/signup', passport.authenticate('signup', { failureRedirect: '/public/failsignup' }), (req, res) => {
	const { username, password } = req.user;
	const user = { username, password };
	res.redirect('/public/');
});

routerProductos.get('/failsignup', async (req, res) => {
	res.sendFile(__dirname + '/public/failsignup.html');
});

routerProductos.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			res.send('no pudo deslogear');
		} else {
			res.sendFile(__dirname + '/public/logout.html');
		}
	});
});

const checkAuthentication = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		console.log('no esta autenticado');
		res.redirect('/public/login');
	}
};

routerProductos.get('/', checkAuthentication, async (req, res) => {
	console.log('no se q ' + req.session.cookie.maxAge);
	res.sendFile(__dirname + '/public/index.html');
});

routerProductos.get('/productos-test', checkAuthentication, async (req, res) => {
	res.sendFile(__dirname + '/public/productosAzar/productosAzar.html');
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

	socket.emit('randomProduct-list', productosGenerados());
});
