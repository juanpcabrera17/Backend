const carritoContenedor = require('../database/containerCarrito');
const contenedor = new carritoContenedor();

const { purchaseEmail } = require('../config/configNodemailer');
const { purchaseSMS, purchaseWPP } = require('../config/configTwilio');

const getCarritoById = async (username) => {
	const objeto = await contenedor.getById(username);
	return objeto;
};

const addTotalCost = (objeto) => {
	let products = objeto[0].productos;
	let totalCost = 0;
	products = products.map((product) => {
		const productTotal = product.price * product.quantity;
		totalCost += productTotal;
		return {
			name: product.name,
			price: product.price,
			thumbnail: product.thumbnail,
			quantity: product.quantity,
			total: productTotal,
		};
	});
	return { products, totalCost };
};

const addTotalQuantity = (products) => {
	let totalQuantity = 0;
	products.forEach((product) => {
		totalQuantity += product.quantity;
	});
	return totalQuantity;
};

const saveProductInCart = async (username, body) => {
	let carritos = await contenedor.saveProducto(username, body);
	return carritos;
};

const endPurchase = (products) => {
	//const total = products.totalCost;

	const productsMap = products.name.map((value, index) => {
		return {
			name: products.name[index],
			price: products.price[index],
			quantity: products.quantity[index],
			total: products.total[index],
		};
	});
	const productsString = JSON.stringify(productsMap);
	return productsString;
};

const notify = (user, compra, total) => {
	purchaseEmail(user, compra, total);
	purchaseSMS(user.phoneNumber);
	purchaseWPP(user);
};

module.exports = {
	getCarritoById,
	addTotalCost,
	addTotalQuantity,
	saveProductInCart,
	endPurchase,
	notify,
};
