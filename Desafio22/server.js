import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import crypto from 'crypto';

const schema = buildSchema(`
  type Producto {
    _id: ID!
    name: String,
    price: Int,
	stock: Int,
	thumbnail: String,
	category: String
	timestamp: String
  }
  input ProductoInput {
	name: String,
    price: Int,
	stock: Int,
	thumbnail: String,
	category: String
  }
  type Query {
	getProductos(campo: String, valor: String): [Producto],
    getById(_id: ID!): Producto,
	getByCategory(category: String): [Producto]
  }
  type Mutation {
    save(datos: ProductoInput): Producto,
    replace(_id: ID!, datos: ProductoInput): Producto,
	deleteById(_id: ID!): Producto
  }
`);

const app = express();

app.use(
	'/graphql',
	graphqlHTTP({
		schema: schema,
		rootValue: {
			getProductos,
			getById,
			save,
			replace,
			deleteById,
		},
		graphiql: true,
	})
);

const PORT = 8080;
app.listen(PORT, () => {
	const msg = `Servidor corriendo en puerto: http://localhost:${PORT}/graphql`;
	console.log(msg);
});

class Producto {
	constructor(_id, { name, price, stock, thumbnail, category }) {
		this._id = _id;
		this.name = name;
		this.price = price;
		this.stock = stock;
		this.thumbnail = thumbnail;
		this.category = category;
		this.timestamp = new Date(Date.now()).toLocaleString();
	}
}

let productosMap = {};

function getProductos({ campo, valor }) {
	const productos = Object.values(productosMap);
	if (campo && valor) {
		return productos.filter((p) => p[campo] == valor);
	} else {
		return productos;
	}
}

function getById({ _id }) {
	let producto = productosMap[_id];
	if (producto) {
		return producto;
	} else {
		console.log('Producto no encontrado');
	}
}

function save({ datos }) {
	const _id = crypto.randomBytes(10).toString('hex');
	const nuevoProducto = new Producto(_id, datos);
	productosMap[_id] = nuevoProducto;
	return nuevoProducto;
}

function replace({ _id, datos }) {
	let producto = productosMap[_id];
	if (producto) {
		const productoActualizado = new Producto(_id, datos);
		productosMap[_id] = productoActualizado;
		return productoActualizado;
	} else {
		console.log('Producto no encontrado');
	}
}

function deleteById({ _id }) {
	let producto = productosMap[_id];
	if (producto) {
		delete productosMap[_id];
		return producto;
	} else {
		console.log('Producto no encontrado');
	}
}
