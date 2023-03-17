const { fork } = require('child_process');

const computo = (cantidad) => {
	let calculo = fork('./computo.js');
	calculo.send({ data: cantidad });

	calculo.on('message', (msg) => {
		const data = JSON.stringify(msg, null, 4);
		return data;
	});
};

module.exports = computo;
