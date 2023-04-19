const { getInfoUser, getInfoSignup, getAllData } = require('../service/serviceUser');
const { registerEmail } = require('../config/configNodemailer');
const { loggerWarn, loggerError } = require('../config/configWinston');

const checkAuthentication = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		loggerWarn.info('no esta autenticado');
		res.redirect('/api/usuario/login');
	}
};

const controllerGetLogin = (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/api/productos');
	} else {
		return res.render('login');
	}
};

const controllerPostLogin = (req, res) => {
	const user = getInfoUser(req.user);
	res.redirect(302, '/api/productos');
};

const controllerGetFailLogin = (req, res) => {
	res.render('FailLogin');
};

const controllerGetSignup = (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/api/productos');
	} else {
		res.render('signup');
	}
};

const controllerPostSignup = (req, res) => {
	const user = getInfoSignup(req.user);
	registerEmail(user);
	res.redirect('/api/productos');
};

const controllerGetFailSignup = (req, res) => {
	res.render('failSignup');
};

const controllerGetLogout = (req, res) => {
	const username = req.user.username;

	req.session.destroy((err) => {
		if (err) {
			loggerError.error(`error: ${err}`);
			res.send('no pudo deslogear');
		} else {
			res.render('logout', { username });
		}
	});
};

const controllerGetInfo = (req, res) => {
	const data = getAllData();
	res.render('info', data);
};

module.exports = {
	checkAuthentication,
	controllerGetLogin,
	controllerPostLogin,
	controllerGetFailLogin,
	controllerGetSignup,
	controllerPostSignup,
	controllerGetFailSignup,
	controllerGetLogout,
	controllerGetInfo,
};
