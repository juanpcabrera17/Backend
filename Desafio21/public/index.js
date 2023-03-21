const socket = io();
socket.on('connect', () => {
	console.log('WebSocket conectado');
});

const schema = normalizr.schema;
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const authorSchema = new schema.Entity('authors', {}, { idAttribute: 'idEmail' });
const messageSchema = new schema.Entity(
	'messages',
	{
		author: authorSchema,
	},
	{ idAttribute: '_id' }
);
const messageList = [messageSchema];

/* function enviarProducto() {
	const name = document.getElementById('name').value;
	const price = document.getElementById('price').value;
	const thumbnail = document.getElementById('thumbnail').value;

	socket.emit('product', { name: name, price: price, thumbnail: thumbnail });
} */

socket.on('msg', (data) => {
	console.log(data);
});

socket.on('msg-list', (data) => {
	const denormalized = denormalize(data.result, messageList, data.entities);
	const normalizedLength = JSON.stringify(data).length;
	const denormalizedLength = JSON.stringify(denormalized).length;
	console.log('tamaño normalizado: ' + normalizedLength);
	console.log('tamaño desnormalizado: ' + denormalizedLength);
	const compresion = ((denormalizedLength - normalizedLength) * 100) / denormalizedLength;
	console.log('compresion: %' + compresion);

	let html = '';
	denormalized.forEach((item) => {
		html += `
		<div class="flex flex-nowrap items-center pb-2">
			(${item.socketid}) <span class= "text-sky-700 font-bold mx-2">${item.author.idEmail}</span> <span class="text-amber-800 mx-2">[${item.fecha}]:</span><span class="text-green-700 italic mx-2"> ${item.text}</span><img src="${item.author.avatar}" class="mx-2" style="max-width: 8%"/>
		</div>
		`;
	});
	document.getElementById('div-list-msgs').innerHTML = html;

	let htmlCompresion = '';
	{
		htmlCompresion += `
	<h3>
		Porcentaje de compresión: %${compresion.toFixed(2)}
	</h3>
	`;
	}
	document.getElementById('compresion').innerHTML = htmlCompresion;
});

async function enviarMsg() {
	const idEmail = document.getElementById('idEmail').value;
	const nombre = document.getElementById('nombre').value;
	const apellido = document.getElementById('apellido').value;
	const edad = document.getElementById('edad').value;
	const alias = document.getElementById('alias').value;
	const avatar = document.getElementById('avatar').value;
	const text = document.getElementById('text').value;

	const Objeto = {
		author: {
			idEmail: idEmail,
			nombre: nombre,
			apellido: apellido,
			edad: edad,
			alias: alias,
			avatar: avatar,
		},
		text: text,
	};

	await socket.emit('msg', Objeto);
}

function id(number) {
	socket.emit('id', number);
}

function deleteId(number) {
	socket.emit('deleteId', number);
}

function deleteAll() {
	socket.emit('deleteAll');
}

function replace(number, body) {
	socket.emit('replace', number, body);
}

const modalToggles = document.querySelectorAll('[data-modal-toggle]');

modalToggles.forEach((toggle) => {
	toggle.addEventListener('click', () => {
		const target = toggle.dataset.modalTarget;
		const modal = document.getElementById(target);

		if (modal) {
			modal.classList.toggle('hidden');
			modal.setAttribute('aria-hidden', modal.classList.contains('hidden'));
			document.body.classList.toggle('modal-open');
		}
	});
});

const modalHides = document.querySelectorAll('[data-modal-hide]');

modalHides.forEach((hide) => {
	hide.addEventListener('click', () => {
		const target = hide.dataset.modalHide;
		const modal = document.getElementById(target);

		if (modal) {
			modal.classList.add('hidden');
			modal.setAttribute('aria-hidden', modal.classList.contains('hidden'));
			document.body.classList.remove('modal-open');
		}
	});
});
