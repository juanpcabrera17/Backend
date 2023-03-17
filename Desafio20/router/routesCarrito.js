const { Router } = require('express');

const {
	controllerGetCarrito,
	controllerPostCarrito,
	controllerPostCarritoComprar,
} = require('../controller/controllerCarrito');

const { checkAuthentication } = require('../controller/controllerUsuario');

const routerCarrito = new Router();

routerCarrito.get('/:username', checkAuthentication, controllerGetCarrito);
routerCarrito.post('/:username', controllerPostCarrito);

routerCarrito.post('/', controllerPostCarritoComprar);

//vaciar carrito
//elimiar del carrito

module.exports = routerCarrito;
