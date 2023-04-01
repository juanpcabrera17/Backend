import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	stock: { type: Number, required: true, max: 1000 },
	thumbnail: { type: String, required: true },
	category: { type: String, required: true },
	timestamp: { type: String, required: true, max: 100 },
});

export interface Producto extends mongoose.Document {
	readonly _id: string;
	readonly name: string;
	readonly price: number;
	readonly stock: number;
	readonly thumbnail: string;
	readonly category: string;
	readonly timestamp: string;
}
