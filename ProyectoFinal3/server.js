const express = require('express');
const compression = require('compression');
const app = express();
const os = require('os');
const { engine } = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
if (process.env.MODE != 'production') {
	require('dotenv').config();
}
const MongoDBconnection = process.env.MONGODBCONNECTION;
const { loggerWarn } = require('./winston');
const { loggerError } = require('./winston');
const Contenedor = require('./classContenedor');
const contenedor = new Contenedor();
const Chat = require('./chatContenedor');
const chat = new Chat();
const Carrito = require('./carritosContenedor');
const carrito = new Carrito();
const { fork } = require('child_process');
const PORT = process.env.PORT;

const Usuarios = require('./usersModel');
const bcrypt = require('bcrypt');

const productosGenerados = require('./faker');
const { registerEmail, purchaseEmail } = require('./nodemailer');
const { purchaseSMS, purchaseWPP } = require('./twilio');

//IMPLEMENTACION
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

mongoose
	.connect(MongoDBconnection)
	.then(() => loggerWarn.info('Connected to Mongo'))
	.catch((e) => {
		loggerError.error(e);
		throw 'can not connect to the mongo!';
	});

const isValidPassword = (user, password) => {
	return bcrypt.compareSync(password, user.password);
};

const createHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

passport.use(
	'login',
	new LocalStrategy((idEmail, password, done) => {
		Usuarios.findOne({ idEmail }, (err, user) => {
			if (err) return done(err);

			if (!user) {
				loggerWarn.info('Ningun usuario encontrado con el email ' + idEmail);
				return done(null, false);
			}

			if (!isValidPassword(user, password)) {
				loggerWarn.info('Contraseña invalida');
				return done(null, false);
			}
			done(null, user);
		}).lean();
	})
);

passport.use(
	'signup',
	new LocalStrategy(
		{
			passReqToCallback: true,
			usernameField: 'idEmail',
		},
		(req, idEmail, password, done) => {
			Usuarios.findOne({ idEmail: idEmail }, function (err, user) {
				if (err) {
					loggerError.error('Error en el signup: ' + err);
					return done(err);
				}

				if (user) {
					loggerWarn.warn('El usuario ya existe');
					return done(null, false);
				}

				const newUser = {
					idEmail: idEmail,
					username: req.body.username,
					password: createHash(password),
					name: req.body.name,
					surname: req.body.surname,
					age: req.body.age,
					alias: req.body.alias,
					phoneNumber: req.body.phoneNumber,
					avatar: req.body.avatar,
				};
				Usuarios.create(newUser, (err, userWithId) => {
					if (err) {
						loggerError.error('Error guardando el usuario: ' + err);
						return done(err);
					}
					loggerWarn.info(user);
					loggerWarn.info('El usuario fue registrado con exito');
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
			mongoUrl: MongoDBconnection,
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
	loggerWarn.info(`Example app listening on port http://localhost:${PORT}`);
});

app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
	'hbs',
	engine({
		extname: '.hbs',
		defaultLayout: 'index.hbs',
		layoutsDir: __dirname + '/views/layouts',
		partialsDir: __dirname + '/views/partials',
	})
);

app.use('/public', express.static(__dirname + '/public', { index: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());
app.use((req, res, next) => {
	loggerWarn.info({ metodo: req.method, path: req.path });
	next();
});

app.get('/login', async (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/');
	} else {
		return res.render('login');
	}
});

app.post(
	'/login',
	passport.authenticate('login', { failureRedirect: '/faillogin' }),
	(req, res) => {
		const { username, password } = req.user;
		const user = { username, password };
		loggerWarn.info(user);
		res.redirect(302, '/');
	}
);

app.get('/faillogin', async (req, res) => {
	res.render('failLogin');
});

app.get('/signup', (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/');
	} else {
		res.render('signup');
	}
});

app.post(
	'/signup',
	passport.authenticate('signup', { failureRedirect: '/failsignup' }),
	(req, res) => {
		const { idEmail, username, password, name, surname, age, alias, phoneNumber, avatar } =
			req.user;
		const user = {
			idEmail,
			username,
			password,
			name,
			surname,
			age,
			alias,
			phoneNumber,
			avatar,
		};

		loggerWarn.info(user);
		registerEmail(user);
		res.redirect('/');
	}
);

app.get('/failsignup', async (req, res) => {
	res.render('failSignup');
});

app.get('/logout', (req, res) => {
	const username = req.user.username;
	req.session.destroy((err) => {
		if (err) {
			loggerError.error(err);
			res.send('no pudo deslogear');
		} else {
			res.render('logout', { username, PORT });
		}
	});
});

const checkAuthentication = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		loggerWarn.info('no esta autenticado');
		res.redirect('/login');
	}
};

app.get('/', checkAuthentication, async (req, res) => {
	const { idEmail, username, name, surname, age, alias, phoneNumber, avatar } = req.user;

	let products = await contenedor.getAll();
	let productsExist = false;
	if (products.length != 0) {
		productsExist = true;
	}
	res.render('home', {
		idEmail,
		username,
		name,
		surname,
		age,
		alias,
		phoneNumber,
		avatar,
		PORT,
		productsExist,
		products,
		layout: 'socketClient',
	});
});

app.get('/:category', checkAuthentication, async (req, res) => {
	const { idEmail, username, name, surname, age, alias, phoneNumber, avatar } = req.user;

	const { category } = req.params;
	let products = await contenedor.getByCategory(category);
	let productsExist = false;
	if (products.length != 0) {
		productsExist = true;
	}

	res.render('home', {
		idEmail,
		username,
		name,
		surname,
		age,
		alias,
		phoneNumber,
		avatar,
		PORT,
		productsExist,
		products,
		layout: 'socketClient',
	});
});

app.get('/productos-test', async (req, res) => {
	res.sendFile(__dirname + '/public/productosAzar/productosAzar.html');
});

app.get('/info', (req, res) => {
	const data = {
		/* args: args, */
		os: process.platform,
		version: process.version,
		memory: process.memoryUsage().rss,
		path: process.execPath,
		id: process.pid,
		folder: process.cwd(),
		cpus: os.cpus().length,
	};
	/* console.log(data); */ // comentar o descomentar para evaluar el rendimiento del servidor
	res.render('info', data);
});

app.get('/api/randoms', (req, res) => {
	const cantidad = JSON.stringify(req.query.cant);
	let computo = fork('./computo.js');
	computo.send({ data: cantidad });

	computo.on('message', (msg) => {
		const data = JSON.stringify(msg, null, 4);
		res.end(`El resultado es: \n ${data}`);
	});
});

app.get('/carrito/:username', checkAuthentication, async (req, res) => {
	const { idEmail, username, name, surname, age, alias, phoneNumber, avatar } = req.user;
	const objeto = await carrito.getById(username);
	if (objeto) {
		let products = objeto[0].productos;
		let totalCost = 0;
		products = products.map((product) => {
			const productTotal = product.price * product.quantity;
			totalCost += productTotal;
			return {
				name: product.name,
				price: product.price,
				thumbnail: product.thumbnail,
				quantity: product.quantity,
				total: productTotal,
			};
		});
		loggerWarn.info(products);

		let totalQuantity = 0;
		products.forEach((product) => {
			totalQuantity += product.quantity;
		});

		res.render('cart', {
			idEmail,
			username,
			name,
			surname,
			age,
			alias,
			phoneNumber,
			avatar,
			products,
			totalCost,
			totalQuantity,
			layout: 'socketClient',
		});
	} else {
		res.send('carrito no encontrado');
	}
});

//boton agregar al carrito
app.post('/carrito/:username', async (req, res) => {
	const { username } = req.params;
	const { body } = req;
	const carritos = await carrito.saveProducto(username, body);

	if (carritos) {
		loggerWarn.info('producto agregado al carrito');
	} else {
		res.json({ error: true });
	}
});

//boton comprar
app.post('/carrito', async (req, res) => {
	const user = req.user;
	const products = req.body;
	const total = products.totalCost;

	const productsMap = products.name.map((value, index) => {
		return {
			name: products.name[index],
			price: products.price[index],
			quantity: products.quantity[index],
			total: products.total[index],
		};
	});

	const productsString = JSON.stringify(productsMap);

	if (productsMap) {
		purchaseEmail(user, productsString, total);
		purchaseSMS(user.phoneNumber);
		purchaseWPP(user);
		res.json('muchas gracias por su compra!');
	} else {
		res.json({ error: true });
	}
});

//boton vaciar carrito
app.delete('/carrito/:id', async (req, res) => {
	const { id } = req.params;
	const carritos = await carrito.deleteById(id);

	if (carritos) {
		res.json({ success: true });
	} else {
		res.json({ error: true, msg: 'carrito no encontrado' });
	}
});

//boton eliminar del carrito
app.delete('/carrito/:id/productos/:id_prod', async (req, res) => {
	const { id } = req.params;
	const { id_prod } = req.params;
	const carritos = await carrito.deleteProductById(id, id_prod);

	if (carritos) {
		res.json({ success: true });
	} else {
		res.json({ error: true, msg: 'carrito/producto no encontrado' });
	}
});

app.get('*', (req, res) => {
	loggerWarn.warn({ metodo: req.method, path: req.path });
	res.status(404).send('error 404 not found');
});

io.on('connection', async (socket) => {
	// "connection" se ejecuta la primera vez que se abre una nueva conexión
	loggerWarn.info(`se conectó el cliente: [${socket.id}]`);

	/* socket.emit('product-list', await contenedor.getAll()); */

	socket.emit('msg-list', await chat.getChat());

	socket.on('msg', async (data) => {
		loggerWarn.info('data', data);
		const fechaActual = Date.now();
		const fecha = new Date(fechaActual);
		const fechaFormat = fecha.toLocaleString();

		await chat.saveChat({ socketid: socket.id, fecha: fechaFormat, ...data });
		io.emit('msg-list', await chat.getChat());
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
