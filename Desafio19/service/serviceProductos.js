const productsContenedor = require('../database/containerProducts');
const contenedor = new productsContenedor();

const getProducts = async () => {
	let products = await contenedor.getAll();
	return products;
};

const getProductsByCategory = async (category) => {
	let products = await contenedor.getByCategory(category);
	return products;
};

module.exports = { getProducts, getProductsByCategory };
