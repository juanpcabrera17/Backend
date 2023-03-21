const request = require('supertest')('http://localhost:8000');
const expect = require('chai').expect;
const faker = require('@faker-js/faker').faker;

const generatePost = () => {
	return {
		name: faker.commerce.productName(),
		price: faker.datatype.number({ max: 1000 }),
		stock: faker.datatype.number({ max: 100 }),
		thumbnail: faker.image.technics((width = 640), (height = 480), (randomize = true)),
		category: faker.helpers.arrayElement(['routers', 'antenas', 'switches', 'otros']),
	};
};

const getRandomId = (ids) => {
	const id = faker.helpers.arrayElement(ids);
	return id;
};

describe('test GET, POST and PUT /api/productos', () => {
	//GET
	describe('GET ALL', () => {
		it('deberia responder con status 200 y ser array', async () => {
			const res = await request.get('/api/productos');
			expect(res.status).to.eql(200);
			expect(res.body).to.be.a('array');
		});
	});

	//POST
	describe('POST ONE', () => {
		it('deberia responder con status 201 y el producto ingresado', async () => {
			const post = generatePost();

			const res = await request.post('/api/productos').send(post);
			expect(res.status).to.eql(201);
			expect(res.body).to.be.a('object');
			expect(res.body).to.include.keys(
				'name',
				'price',
				'stock',
				'thumbnail',
				'category',
				'timestamp'
			);
			expect(post.name).to.eql(res.body.name);
			expect(post.price).to.eql(res.body.price);
			expect(post.stock).to.eql(res.body.stock);
			expect(post.thumbnail).to.eql(res.body.thumbnail);
			expect(post.category).to.eql(res.body.category);
		});
	});

	//PUT
	describe('PUT ONE', () => {
		it('deberia responder con status 201 y ser array', async () => {
			const post = generatePost();
			const productos = await request.get('/api/productos');
			let ids = productos._body.map(({ _id }) => _id);
			const id = getRandomId(ids);

			const res = await request.put(`/api/productos/${id}`).send(post);

			expect(res.status).to.eql(201);
			expect(res.body).to.be.a('object');
			expect(res.body).to.include.keys(
				'name',
				'price',
				'stock',
				'thumbnail',
				'category',
				'timestamp'
			);
			expect(post.name).to.eql(res.body.name);
			expect(post.price).to.eql(res.body.price);
			expect(post.stock).to.eql(res.body.stock);
			expect(post.thumbnail).to.eql(res.body.thumbnail);
			expect(post.category).to.eql(res.body.category);
		});
	});
});
