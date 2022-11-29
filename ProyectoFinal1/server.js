const express = require('express');
const { Router } = express;
const app = express();
const ContenedorProductos = require('./classProductos');
const contenedorProductos = new ContenedorProductos();
const ContenedorCarrito = require('./classCarrito');
const contenedorCarrito = new ContenedorCarrito();
const routerProductos = Router();
const routerCarrito = Router();
const port = process.env.PORT || 8080;

let isAdmin = true;
//let isAdmin = false;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);
app.use('/public', express.static(__dirname + '/public'));

app.listen(port, () => {
	console.log(`Example app listening on port http://localhost:${port}`);
});

routerProductos.get('/', async (req, res) => {
	const todos = await contenedorProductos.getAll();

	res.json(todos);
});

routerProductos.get('/:id', async (req, res) => {
	const { id } = req.params;
	const objeto = await contenedorProductos.getById(id);

	if (objeto) {
		console.log(objeto);
		res.json({ success: true, product: objeto });
	} else {
		res.json({ error: true, msg: 'producto no encontrado' });
	}
});

routerProductos.post(
	'/',
	(req, res, next) => {
		const method = req.method;
		isAdmin ? next() : res.status(403).json({ error: -1, descripcion: `Ruta /api/productos método ${method} no autorizado` });
	},
	async (req, res) => {
		const { body } = req;
		const productos = await contenedorProductos.save(body);

		if (productos) {
			console.log('producto agregado');
			res.json({ success: true, product: body });
		} else {
			res.json({ error: true });
		}
	}
);

routerProductos.put(
	'/:id',
	(req, res, next) => {
		const path = req.path;
		const method = req.method;
		isAdmin ? next() : res.status(403).json({ error: -1, descripcion: `Ruta /api/productos${path} método ${method} no autorizado` });
	},
	async (req, res) => {
		const { id } = req.params;
		const { body } = req;
		const index = await contenedorProductos.findIndex(id);
		const productos = await contenedorProductos.replace(index, body);

		if (productos) {
			res.json({ success: true, producto: body });
		} else {
			res.json({ error: true, msg: 'producto no encontrado' });
		}
	}
);

routerProductos.delete(
	'/:id',
	(req, res, next) => {
		const path = req.path;
		const method = req.method;
		isAdmin ? next() : res.status(403).json({ error: -1, descripcion: `Ruta /api/productos${path} método ${method} no autorizado` });
	},
	async (req, res) => {
		const { id } = req.params;
		const productos = await contenedorProductos.deleteById(id);

		if (productos) {
			res.json({ success: true });
		} else {
			res.json({ error: true, msg: 'producto no encontrado' });
		}
	}
);

routerCarrito.post('/', async (req, res) => {
	const { body } = req;
	const carrito = await contenedorCarrito.saveCarrito(body);

	if (carrito) {
		console.log('carrito agregado');
		res.json({ success: true, carrito: body });
	} else {
		res.json({ error: true });
	}
});

routerCarrito.delete('/:id', async (req, res) => {
	const { id } = req.params;
	const carrito = await contenedorCarrito.deleteById(id);

	if (carrito) {
		res.json({ success: true });
	} else {
		res.json({ error: true, msg: 'carrito no encontrado' });
	}
});

routerCarrito.get('/:id/productos', async (req, res) => {
	const { id } = req.params;
	const objeto = await contenedorCarrito.getById(id);

	if (objeto) {
		console.log(objeto);
		res.json({ success: true, carrito: objeto });
	} else {
		res.json({ error: true, msg: 'carrito no encontrado' });
	}
});

routerCarrito.post('/:id/productos', async (req, res) => {
	const { id } = req.params;
	const { body } = req;
	const carrito = await contenedorCarrito.saveProducto(id, body);

	if (carrito) {
		console.log('producto agregado al carrito');
		res.json({ success: true, productoAgregado: body });
	} else {
		res.json({ error: true });
	}
});

routerCarrito.delete('/:id/productos/:id_prod', async (req, res) => {
	const { id } = req.params;
	const { id_prod } = req.params;
	const carrito = await contenedorCarrito.deleteProductById(id, id_prod);

	if (carrito) {
		res.json({ success: true });
	} else {
		res.json({ error: true, msg: 'carrito/producto no encontrado' });
	}
});

app.get('/*', (req, res) => {
	const path = req.path;
	const method = req.method;
	res.json({ error: -2, descripcion: `ruta ${path} método ${method} no implementado` });
});
