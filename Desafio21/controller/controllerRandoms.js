const computo = require('../service/serviceRandoms');

const controllerGetRandoms = (req, res) => {
	const cantidad = JSON.stringify(req.query.cant);
	const numeros = computo(cantidad);

	if (computo) {
		res.end(`el resultado es: ${numeros}`);
	}
};

module.exports = controllerGetRandoms;
