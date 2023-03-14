const { Router } = require('express');
const { passport } = require('../config/configServer');

const {
	controllerGetLogin,
	controllerPostLogin,
	controllerGetFailLogin,
	controllerGetSignup,
	controllerPostSignup,
	controllerGetFailSignup,
	controllerGetLogout,
	controllerGetInfo,
} = require('../controller/controllerUsuario');

const routerUsuario = new Router();

routerUsuario.get('/login', controllerGetLogin);
routerUsuario.post(
	'/login',
	passport.authenticate('login', { failureRedirect: '/api/usuario/faillogin' }),
	controllerPostLogin
);

routerUsuario.get('/faillogin', controllerGetFailLogin);

routerUsuario.get('/signup', controllerGetSignup);
routerUsuario.post(
	'/signup',
	passport.authenticate('signup', { failureRedirect: '/api/usuario/failsignup' }),
	controllerPostSignup
);

routerUsuario.get('/failsignup', controllerGetFailSignup);
routerUsuario.get('/logout', controllerGetLogout);
routerUsuario.get('/info', controllerGetInfo);

module.exports = routerUsuario;
