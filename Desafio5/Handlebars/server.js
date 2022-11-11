const express = require('express');
const Contenedor = require('./classContenedor');
const app = express();
const { engine } = require('express-handlebars');
const { Router } = express;
const routerProductos = Router();
const routerFormulario = Router();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/productos', routerProductos);
app.use('/formulario', routerFormulario);
app.use('/public', express.static(__dirname + '/public'));

app.listen(port, () => {
	console.log(`Example app listening on port http://localhost:${port}`);
});

app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
	'hbs',
	engine({
		extname: '.hbs',
		defaultLayout: 'index.hbs',
		layoutsDir: __dirname + '/views/layouts',
		partialsDir: __dirname + '/views/partials',
	})
);

routerProductos.get('/', async (req, res) => {
	console.log('pagina productos');
	const contenedor = new Contenedor();
	const todos = await contenedor.getAll();
	let productsExist = true;

	if (todos.length === 0) {
		productsExist = false;
	}

	res.render('listaproductos', { title: 'Lista de productos', products: todos, productsExist: productsExist });
});

routerProductos.post('/', async (req, res) => {
	const { body } = req;
	const contenedor = new Contenedor();
	const productos = await contenedor.save(body);

	if (productos) {
		console.log('producto agregado');
		res.render('gracias');
	} else {
		res.json({ error: true });
	}
});

routerFormulario.get('/', async (req, res) => {
	console.log('pagina formulario');

	res.render('formulario', { title: 'Formulario de ingreso' });
});
