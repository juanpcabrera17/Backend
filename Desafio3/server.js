const express = require("express")
const Contenedor = require("./classContenedor")
const app = express()
const fs = require("fs")
const PORT = process.env.PORT || 8081

app.get("/productos", async (req, res) => {
	const contenedor = new Contenedor()
	const todos = await contenedor.getAll()

	res.json(todos)
})

app.get("/productoRandom", async (req, res) => {
	const contenedor = new Contenedor()
	const todos = await contenedor.getAll()

	const objetos = Object.values(todos)
	const objetoRandom = objetos[parseInt(Math.random() * objetos.length)]

	res.json(objetoRandom)
})

app.listen(PORT, () => {
	console.log(`servidor Http escuchando en el puerto http://localhost:${PORT}`)
})