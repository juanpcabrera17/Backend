import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Producto } from '../interfaces/productos/productos.interface';

@Injectable()
export class ProductosService {
	private productos: Producto[] = [];

	constructor(
		@InjectModel('Producto') private readonly productModel: Model<Producto>,
	) {}

	async save(
		name: string,
		price: number,
		stock: number,
		thumbnail: string,
		category: string,
	) {
		const fechaActual = new Date(Date.now()).toLocaleString();
		const newProduct = new this.productModel({
			name: name,
			price: price,
			stock: stock,
			thumbnail: thumbnail,
			category: category,
			timestamp: fechaActual,
		});
		const result = await newProduct.save();
		return result;
	}

	async getAll() {
		try {
			const res = await this.productModel.find({}).lean();
			return res;
		} catch (err) {
			console.log(err);
		}
	}

	async getById(Number: string): Promise<Producto> {
		try {
			const producto = await this.productModel.findById(Number);
			if (!producto) {
				throw new NotFoundException('No se pudo encontrar el producto');
			}
			return producto;
		} catch (err) {
			console.log(err);
		}
	}

	async updateProduct(ProductId: string, Body) {
		try {
			const fechaActual = new Date(Date.now()).toLocaleString();
			Body.timestamp = fechaActual;
			await this.productModel.updateOne({ _id: ProductId }, { $set: Body });

			const newObj = await this.productModel.find({ _id: ProductId }).limit(1);
			return newObj;
		} catch (err) {}
	}

	async deleteById(ProductId: string) {
		try {
			const result = await this.productModel.deleteOne({ _id: ProductId });
			if (result) {
				console.log('producto eliminado');
			}
		} catch (err) {
			console.log(err);
		}
	}
}
