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
const routerUser = new Router();

routerUser.get('/login', controllerGetLogin);
routerUser.post(
	'/login',
	passport.authenticate('login', { failureRedirect: '/api/usuario/faillogin' }),
	controllerPostLogin
);

routerUser.get('/faillogin', controllerGetFailLogin);

routerUser.get('/signup', controllerGetSignup);
routerUser.post(
	'/signup',
	passport.authenticate('signup', { failureRedirect: '/api/usuario/failsignup' }),
	controllerPostSignup
);

routerUser.get('/failsignup', controllerGetFailSignup);
routerUser.get('/logout', controllerGetLogout);
routerUser.get('/info', controllerGetInfo);

module.exports = routerUser;
