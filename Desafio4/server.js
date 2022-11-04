const express = require("express");
const Contenedor = require("./classContenedor");
const { Router } = express;
const app = express();
const routerProductos = Router();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
	console.log(`Example app listening on port http://localhost:${port}`);
});

app.use("/api/productos", routerProductos);
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.send(
		"<h1>Bienvenido al e-commerce, ingrese a la /productos para ver los productos disponibles</h1>"
	);
});

routerProductos.get("/", async (req, res) => {
	const contenedor = new Contenedor();
	const todos = await contenedor.getAll();

	res.json(todos);
});

routerProductos.get("/:id", async (req, res) => {
	const { id } = req.params;
	const contenedor = new Contenedor();
	const objeto = await contenedor.getById(id);

	if (objeto) {
		res.json({ success: true, product: objeto });
	} else {
		res.json({ error: true, msg: "producto no encontrado" });
	}
});

routerProductos.post("/", async (req, res) => {
	const { body } = req;
	const contenedor = new Contenedor();
	const productos = await contenedor.save(body);

	if (productos) {
		res.json({ success: true, product: body });
	} else {
		res.json({ error: true });
	}
});

routerProductos.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { body } = req;
	const contenedor = new Contenedor();
	const index = await contenedor.findIndex(id);
	const productos = await contenedor.replace(index, body);

	if (productos) {
		res.json({ success: true, producto: body });
	} else {
		res.json({ error: true, msg: "producto no encontrado" });
	}
});

routerProductos.delete("/:id", async (req, res) => {
	const { id } = req.params;
	const contenedor = new Contenedor();
	const productos = await contenedor.deleteById(id);

	if (productos) {
		res.json({ success: true });
	} else {
		res.json({ error: true, msg: "producto no encontrado" });
	}
});

app.get("/formulario", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

app.post("/formulario", async (req, res) => {
	const { body } = req;
	const contenedor = new Contenedor();
	const productos = await contenedor.save(body);

	if (productos) {
		res.json({ success: true, product: body });
	} else {
		res.json({ error: true });
	}
});
