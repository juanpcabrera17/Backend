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

const saveProduct = async (body) => {
	let product = await DAO.productos.save(body);
	return product;
};

const replaceProduct = async (id, body) => {
	let product = await DAO.productos.replace(id, body);
	return product;
};

module.exports = { getProducts, getProductsByCategory, saveProduct, replaceProduct };
