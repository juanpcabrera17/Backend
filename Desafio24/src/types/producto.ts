export interface Producto {
	ppid: string;
	name: string;
	price: number;
	stock: number;
	thumbnail: string;
	category: string;
}

///////////
export interface ProductForUpdate {
	name?: string;
	price?: number;
	stock?: number;
	thumbnail?: string;
	category?: string;
}

export interface ProductForCreation {
	name: string;
	price: number;
	stock: number;
	thumbnail: string;
	category: string;
}
