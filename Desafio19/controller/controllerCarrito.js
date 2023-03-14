const { getInfoSignup } = require('../service/serviceUsuario');
const {
	getCarritoById,
	addTotalCost,
	addTotalQuantity,
	saveProductInCart,
	endPurchase,
	notify,
} = require('../service/serviceCarrito');
const { loggerWarn } = require('../config/configWinston');

const controllerGetCarrito = async (req, res) => {
	const user = getInfoSignup(req.user);

	const objeto = await getCarritoById(user.username);
	if (objeto) {
		let { products, totalCost } = addTotalCost(objeto);
		loggerWarn.info(products);
		let totalQuantity = addTotalQuantity(products);

		res.render('cart', {
			idEmail: user.idEmail,
			username: user.username,
			name: user.name,
			surname: user.surname,
			age: user.age,
			alias: user.alias,
			phoneNumber: user.phoneNumber,
			avatar: user.avatar,
			products,
			totalCost,
			totalQuantity,
			layout: 'socketClient',
		});
	} else {
		res.send('carrito no encontrado');
	}
};

const controllerPostCarrito = async (req, res) => {
	const { username } = req.params;
	const { body } = req;
	const carritos = await saveProductInCart(username, body);

	if (carritos) {
		loggerWarn.info('producto agregado al carrito');
	} else {
		res.json({ error: true });
	}
};

const controllerPostCarritoComprar = async (req, res) => {
	const user = req.user;
	const products = req.body;
	const total = req.body.totalCost; //?

	const compra = endPurchase(products);

	if (compra) {
		notify(user, compra, total);
		res.send('muchas gracias por su compra!');
	} else {
		res.json({ error: true });
	}
};

module.exports = { controllerGetCarrito, controllerPostCarrito, controllerPostCarritoComprar };
