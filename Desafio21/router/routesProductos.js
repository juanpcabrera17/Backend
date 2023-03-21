const { Router } = require('express');

const {
	controllerGetProductos,
	controllerGetProductosByCategory,
	controllerGetProductosTest,
	controllerPostProducto,
	controllerPutProducto,
} = require('../controller/controllerProductos');

const { checkAuthentication } = require('../controller/controllerUsuario');

const routerProductos = new Router();

routerProductos.get('/', /* checkAuthentication, */ controllerGetProductos);
routerProductos.get('/:category', /* checkAuthentication, */ controllerGetProductosByCategory);
routerProductos.get('/productos-test', /* checkAuthentication, */ controllerGetProductosTest);
routerProductos.post('/', /* checkAuthentication, */ controllerPostProducto);
routerProductos.put('/:id', /* checkAuthentication, */ controllerPutProducto);

module.exports = routerProductos;
