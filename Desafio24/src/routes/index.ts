import { Router } from '../deps.ts';
import {
	findProduct,
	saveProduct,
	getAllProducts,
	deleteProduct,
	updateProduct,
} from '../handlers/producto.ts';

export const router = new Router()
	.get('/api/productos/', getAllProducts)
	.get('/api/productos/:productId', findProduct)
	.delete('/api/productos/:productId', deleteProduct)
	.patch('/api/productos/:productId', updateProduct)
	.post('/api/productos', saveProduct);
