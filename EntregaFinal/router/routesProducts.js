const { Router } = require('express');
const {
	controllerGetProducts,
	controllerGetProductsByCategory,
	controllerGetProductsTest,
} = require('../controller/controllerProductos');
const { checkAuthentication } = require('../controller/controllerUsuario');
const routerProducts = new Router();

routerProducts.get('/', checkAuthentication, controllerGetProducts);
routerProducts.get('/test', checkAuthentication, controllerGetProductsTest);
routerProducts.get('/:category', checkAuthentication, controllerGetProductsByCategory);

module.exports = routerProducts;
