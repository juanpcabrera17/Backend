const { getInfoSignup } = require('../service/serviceUser');
const { getProducts, getProductsByCategory } = require('../service/serviceProducts');

const controllerGetProducts = async (req, res) => {
	const user = getInfoSignup(req.user);
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
		layout: 'socketClient',
	});
};

const controllerGetProductsByCategory = async (req, res) => {
	const user = getInfoSignup(req.user);
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

const controllerGetProductsTest = (req, res) => {
	res.render('randomProducts', { layout: false });
};

module.exports = {
	controllerGetProducts,
	controllerGetProductsByCategory,
	controllerGetProductsTest,
};
