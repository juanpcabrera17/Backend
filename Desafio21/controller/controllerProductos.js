const { getInfoSignup } = require('../service/serviceUsuario');
const {
	getProducts,
	getProductsByCategory,
	saveProduct,
	replaceProduct,
} = require('../service/serviceProductos');

const controllerGetProductos = async (req, res) => {
	/* const user = await getInfoSignup(req.user); */
	const products = await getProducts();
	let productsExist = false;

	if (products) {
		productsExist = true;
	}

	/* res.render('home', {
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
	}); */

	res.status(200).json(products);
};

const controllerGetProductosByCategory = async (req, res) => {
	/* const user = await getInfoSignup(req.user); */

	const { category } = req.params;
	const products = await getProductsByCategory(category);
	let productsExist = false;

	if (products) {
		productsExist = true;
	}

	/* res.render('home', {
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
	}); */

	res.status(200).json(products);
};

const controllerGetProductosTest = (req, res) => {
	res.sendFile(__dirname + '/public/productosAzar/productosAzar.html');
};

const controllerPostProducto = async (req, res) => {
	const { body } = req;
	const producto = await saveProduct(body);
	if (producto) {
		res.status(201).json(producto);
	} else {
		res.json({ error: true });
	}
};

const controllerPutProducto = async (req, res) => {
	const { id } = req.params;
	const { body } = req;

	const producto = await replaceProduct(id, body);
	if (producto) {
		res.status(201).json(producto);
	} else {
		res.json({ error: true });
	}
};

module.exports = {
	controllerGetProductos,
	controllerGetProductosByCategory,
	controllerGetProductosTest,
	controllerPostProducto,
	controllerPutProducto,
};
