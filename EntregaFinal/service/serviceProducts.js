const DAO = require('../models/abstractFactory');

const getProducts = async () => {
	let products = await DAO.products.getAll();
	return products;
};

const getProductsByCategory = async (category) => {
	let products = await DAO.products.getByCategory(category);
	return products;
};

module.exports = { getProducts, getProductsByCategory };
