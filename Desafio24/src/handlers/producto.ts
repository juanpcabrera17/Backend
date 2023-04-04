// deno-lint-ignore-file
import { Context, helpers } from '../deps.ts';
import type { Producto, ProductForCreation } from '../types/producto.ts';
import * as db from '../db/producto.ts';

export const getAllProducts = async (ctx: Context) => {
	try {
		const products = await db.getAll();
		ctx.response.status = 200;
		ctx.response.body = {
			success: 'productos encontrados',
			products: products,
		};
		return products;
	} catch (err) {
		ctx.response.status = 404;
		ctx.response.body = { msg: err.message };
	}
};

export const findProduct = async (ctx: Context) => {
	const { productId } = helpers.getQuery(ctx, { mergeParams: true });
	try {
		const product: Producto = await db.getById(productId);
		ctx.response.body = product;
	} catch (err) {
		ctx.response.status = 404;
		ctx.response.body = { msg: err.message };
	}
};

export const saveProduct = async (ctx: Context) => {
	try {
		const { name, price, stock, thumbnail, category } = await ctx.request.body().value;
		const createdProduct: ProductForCreation = db.save({
			name,
			price,
			stock,
			thumbnail,
			category,
		});
		ctx.response.body = createdProduct;
	} catch (err) {
		ctx.response.status = 500;
		ctx.response.body = { msg: err.message };
	}
};

export const deleteProduct = async (ctx: Context) => {
	const { productId } = helpers.getQuery(ctx, { mergeParams: true });

	try {
		const productsFiltered = await db.deleteById(productId);
		ctx.response.status = 200;
		ctx.response.body = {
			success: 'producto eliminado',
			currentProducts: productsFiltered,
		};
	} catch (error) {
		ctx.response.status = 404;
		ctx.response.body = { msg: error.message };
	}
};

export const updateProduct = async (ctx: Context) => {
	const { name, price, stock, thumbnail, category } = await ctx.request.body().value;
	const { productId } = helpers.getQuery(ctx, { mergeParams: true });
	try {
		const updatedProduct = db.update(productId, {
			name,
			price,
			stock,
			thumbnail,
			category,
		});
		ctx.response.body = { msg: 'producto actualizado', updatedProduct: updatedProduct };
	} catch (err) {
		console.log(err);
	}
};
