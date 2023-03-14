const { Router } = require('express');

const {
	controllerGetProductos,
	controllerGetProductosByCategory,
	controllerGetProductosTest,
} = require('../controller/controllerProductos');

const { checkAuthentication } = require('../controller/controllerUsuario');

const routerProductos = new Router();

routerProductos.get('/', checkAuthentication, controllerGetProductos);
routerProductos.get('/:category', checkAuthentication, controllerGetProductosByCategory);
routerProductos.get('/productos-test', checkAuthentication, controllerGetProductosTest);

module.exports = routerProductos;
