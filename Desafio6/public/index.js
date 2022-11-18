const socket = io();
socket.on('connect', () => {
	console.log('me conecte!');
	//socket.emit('msg', 'hola server');
});

socket.on('msg', (data) => {
	console.log(data);
});

socket.on('msg-list', (data) => {
	console.log('msg-list', data);
	let html = '';
	data.forEach((item) => {
		html += `
		<div>
			(${item.socketid}) ${item.email} [${item.fecha}] dijo: ${item.mensaje}
		</div>
		`;
	});
	document.getElementById('div-list-msgs').innerHTML = html;
});

function enviarMsg() {
	const msgParaEnvio = document.getElementById('input-msg').value;
	const email = document.getElementById('input-email').value;

	socket.emit('msg', { email: email, mensaje: msgParaEnvio });
}
