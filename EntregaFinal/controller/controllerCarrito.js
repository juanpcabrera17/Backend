const { getInfoSignup } = require('../service/serviceUser');
const {
	getCarritoById,
	addTotalCost,
	addTotalQuantity,
	saveProductInCart,
	removeProductInCart,
	endPurchase,
	notify,
} = require('../service/serviceCart');
const { loggerWarn } = require('../config/configWinston');

const controllerGetCart = async (req, res) => {
	const user = getInfoSignup(req.user);

	const object = await getCarritoById(user.username);
	if (object) {
		let { products, totalCost } = addTotalCost(object);
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

const controllerPostCart = async (req, res) => {
	const { username } = req.params;
	const { body } = req;
	const carts = await saveProductInCart(username, body);

	if (carts) {
		loggerWarn.info('producto agregado al carrito');
	} else {
		res.json({ error: true });
	}
};

const controllerDeleteProduct = async (req, res) => {
	const { username } = req.params;
	const product = req.body.productId;
	const remove = await removeProductInCart(username, product);
	if (remove) {
		loggerWarn.info('producto eliminado del carrito');
	} else {
		res.json({ error: true });
	}
};

const controllerPostPurchaseCart = async (req, res) => {
	const user = req.user;
	const products = req.body;
	const total = req.body.totalCost;
	const purchase = endPurchase(products);

	if (purchase) {
		notify(user, purchase, total);
		res.send('muchas gracias por su compra!');
	} else {
		res.json({ error: true });
	}
};

module.exports = {
	controllerGetCart,
	controllerPostCart,
	controllerDeleteProduct,
	controllerPostPurchaseCart,
};
