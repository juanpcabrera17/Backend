const { Router } = require('express');
const {
	controllerGetCart,
	controllerPostCart,
	controllerDeleteProduct,
	controllerPostPurchaseCart,
} = require('../controller/controllerCarrito');
const { checkAuthentication } = require('../controller/controllerUsuario');
const routerCart = new Router();

routerCart.get('/:username', checkAuthentication, controllerGetCart);
routerCart.post('/:username', controllerPostCart);
routerCart.delete('/:username', controllerDeleteProduct);

routerCart.post('/', controllerPostPurchaseCart);

module.exports = routerCart;
