const { getInfoSignup } = require('../service/serviceUsuario');
const { getProducts, getProductsByCategory } = require('../service/serviceProductos');

const controllerGetProductos = async (req, res) => {
	const user = await getInfoSignup(req.user);
	const products = await getProducts();
	let productsExist = false;

	if (products) {
		productsExist = true;
	}

	res.render('home', {
		idEmail: user.idEmail,
		username: user.username,
		name: user.name,
		surname: user.surname,
		age: user.age,
		alias: user.alias,
		phoneNumber: user.phoneNumber,
		avatar: user.avatar,
		productsExist,
		products,
		productsExist,
		layout: 'SocketClient',
	});
};

const controllerGetProductosByCategory = async (req, res) => {
	const user = await getInfoSignup(req.user);

	const { category } = req.params;
	const products = await getProductsByCategory(category);
	let productsExist = false;

	if (products) {
		productsExist = true;
	}

	res.render('home', {
		idEmail: user.idEmail,
		username: user.username,
		name: user.name,
		surname: user.surname,
		age: user.age,
		alias: user.alias,
		phoneNumber: user.phoneNumber,
		avatar: user.avatar,
		productsExist,
		products,
		layout: 'socketClient',
	});
};

const controllerGetProductosTest = (req, res) => {
	res.sendFile(__dirname + '/public/productosAzar/productosAzar.html');
};

module.exports = {
	controllerGetProductos,
	controllerGetProductosByCategory,
	controllerGetProductosTest,
};
