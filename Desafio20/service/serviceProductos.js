/* const productsContenedor = require('../database/containerProducts');
const contenedor = new productsContenedor(); */

const DAO = require('../models/abstractFactory');

const getProducts = async () => {
	let products = await DAO.productos.getAll();
	return products;
};

const getProductsByCategory = async (category) => {
	let products = await DAO.productos.getByCategory(category);
	return products;
};

module.exports = { getProducts, getProductsByCategory };
