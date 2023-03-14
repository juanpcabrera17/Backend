const express = require('express');
const app = express();
//os
const compression = require('compression');
const { engine } = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const Usuarios = require('./configUsersModel');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
if (process.env.MODE != 'production') {
	require('dotenv').config();
}
const PORT = process.env.PORT;
const MongoDBconnection = process.env.MONGODBCONNECTION;
const { loggerWarn, loggerError } = require('./configWinston');

const productsContenedor = require('../database/containerProducts');
const contenedor = new productsContenedor();
const chatContenedor = require('../database/containerChat');
const contenedorChat = new chatContenedor();

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

app.set('view engine', 'hbs');
app.set('views', __dirname + '/../views');
app.engine(
	'hbs',
	engine({
		extname: '.hbs',
		defaultLayout: 'index.hbs',
		layoutsDir: __dirname + '/../views/layouts',
		partialsDir: __dirname + '/../views/partials',
	})
);

app.use(express.static('public', { index: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());
app.use((req, res, next) => {
	loggerWarn.info({ metodo: req.method, path: req.path });
	next();
});

module.exports = { app, passport, contenedor, contenedorChat, PORT };
