const socket = io();
socket.on('connect', () => {
	console.log('me conecte!');
});

socket.on('product-list', (data) => {
	let productos = '';

	data.forEach((item) => {
		productos += `
				<!-- Card Item -->
					<div class='my-8 rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white duration-300 hover:-translate-y-1' x-for='(post, index) in posts'>
						<!-- Clickable Area -->
						<figure>
							<!-- Image -->
							<img src='${item.thumbnail}' class='rounded-t h-72 w-full object-contain' />
	
							<figcaption class='p-4 bg-gray-800'>
								<!-- Title -->
								<p class='text-lg mb-4 font-bold leading-relaxed text-gray-800 dark:text-gray-300' x-text='post.title'>
								${item.name}
									<!-- Post Title -->
								</p>
	
								<p class='text-lg mb-4 font-bold leading-relaxed text-gray-800 dark:text-gray-300' x-text='post.title'>
								$ ${item.price}
									<!-- Post Title -->
								</p>
	
								<!-- Description -->
								<small class='leading-5 text-gray-500 dark:text-gray-400' x-text='post.description'>
									<!-- Post Description -->
								</small>
							</figcaption>
						</figure>
					</div>
		`;
	});

	document.getElementById('div-list-productos').innerHTML = productos;
});

function enviarProducto() {
	const name = document.getElementById('name').value;
	const price = document.getElementById('price').value;
	const thumbnail = document.getElementById('thumbnail').value;

	socket.emit('product', { name: name, price: price, thumbnail: thumbnail });
}

socket.on('msg', (data) => {
	console.log(data);
});

socket.on('msg-list', (data) => {
	console.log('msg-list', data);
	let html = '';
	data.forEach((item) => {
		html += `
		<div>
			(${item.socketid}) <span class= "text-sky-700 font-bold">${item.email}</span> <span class="text-amber-800">[${item.fecha}]</span><span class="text-green-700 italic ">: ${item.mensaje}</span>
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
