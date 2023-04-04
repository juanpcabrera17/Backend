// deno-lint-ignore-file
import type { Producto, ProductForCreation, ProductForUpdate } from '../types/producto.ts';
import { v1 } from '../deps.ts';

let productos: Producto[] = [];

export const getAll = async () => {
	return productos;
};

export const getById = (ppid: string) => {
	let foundProduct = productos.find((producto) => producto.ppid === ppid);
	console.log('producto encontrado: ' + foundProduct);

	if (!foundProduct) {
		throw new Error('Producto no encontrado');
	} else {
		return foundProduct;
	}
};

export const save = (producto: ProductForCreation): Producto => {
	productos.push({
		ppid: v1.generate().toString(),
		name: producto.name,
		price: producto.price,
		stock: producto.stock,
		thumbnail: producto.thumbnail,
		category: producto.category,
	});
	return {
		ppid: v1.generate().toString(),
		name: producto.name,
		price: producto.price,
		stock: producto.stock,
		thumbnail: producto.thumbnail,
		category: producto.category,
	};
};

export const deleteById = async (ppid: string) => {
	const filteredProducts = productos.filter((producto) => producto.ppid !== ppid);
	productos = filteredProducts;
	if (!filteredProducts) {
		throw new Error('User not found');
	} else {
		return filteredProducts;
	}
};

export const update = (ppid: string, productForUpdate: ProductForUpdate) => {
	const producto = productos.find((producto) => producto.ppid === ppid);
	if (producto) {
		const newProductos = productos.map((producto) => {
			if (ppid == producto.ppid) {
				return {
					...producto,
					...productForUpdate,
				};
			} else {
				return producto;
			}
		});
		productos = newProductos;
	} else {
		throw new Error('no existe el producto con ese id');
	}
};
