/* const serviceAccount = require('../../privi.json'); */
/* const db = getFirestore(); --> poner en dao y pasar parametro¿? */
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

class contenedorFirebase {
	constructor(serviceAccount, collection) {
		this.serviceAccount = serviceAccount;
		this.collection = collection;
	}

	// Establece la conección con Firebase

	connection = async () => {
		try {
			await admin.initializeApp({ credential: admin.credential.cert(this.serviceAccount) });
			const db = getFirestore();

			console.log('conectado: Firebase');
			return (this.db = db);
		} catch (err) {
			console.log(err);
			throw 'cannot connect to the db';
		}
	};

	// Devuelve todos los objetos presentes en la base de datos

	getAll = async () => {
		try {
			const res = await this.db.collection(this.collection).get();
			let arrayRes = res.docs.map((item) => {
				return { id: item.id, ...item.data() };
			});
			return arrayRes;
		} catch (err) {
			console.log(err);
		}
	};

	// Guarda el objeto ingresado en la base de datos

	save = async (Object) => {
		try {
			const fechaActual = new Date(Date.now()).toLocaleString();
			Object.timestamp = fechaActual;
			console.log(this.db);
			const savedObject = await this.db
				.collection(this.collection)
				.doc()
				.set({ ...Object });
			console.log(savedObject);
			return savedObject;
		} catch (err) {
			console.log(err);
		}
	};

	// Recibe un id, devuelve el objeto con ese id, o null si no esta

	getById = async (Number) => {
		try {
			const res = await this.db.collection(this.collection).doc(Number);
			return res;
		} catch (err) {
			console.log(err);
		}
	};

	// Elimina del archivo el objeto con el id ingresado

	deleteById = async (Number) => {
		try {
			const res = await this.db.collection(this.collection).doc(Number).delete();
			return res;
		} catch (err) {
			console.log(err);
		}
	};

	// Elimina todos los objetos presentes en el archivo

	deleteAll = async () => {
		try {
			const res = await db.collection('usuarios').delete();
			console.log('todos los objetos fueron eliminados');
			return res;
		} catch (err) {
			console.log(err);
		}
	};

	findIndex = async (Number) => {
		try {
			return Number;
		} catch (err) {
			console.log(err);
		}
	};

	replace = async (Number, Body) => {
		try {
			const fechaActual = new Date(Date.now()).toLocaleString();
			Body.timestamp = fechaActual;

			const refDoc = this.db.collection(this.collection).doc(Number);
			const res = await refDoc.update(Body);
			console.log(res);
			return res;
		} catch (err) {
			console.log(err);
		}
	};

	// Guarda el objeto en el carrito indicado

	saveProducto = async (Number, Body) => {
		try {
			const fechaActual = new Date(Date.now()).toLocaleString();
			Body.timestamp = fechaActual;

			const savedObject = await this.db
				.collection(this.collection)
				.doc(Number)
				.set({ ...Body });
			console.log(savedObject);
			return savedObject;
		} catch (err) {
			console.log(err);
		}
	};

	// Elimina el objeto con el id ingresado

	deleteProductById = async (Number1, Number2) => {
		try {
			const Id = parseInt(Number2);

			const res = await this.db.collection(this.collection).doc(Number1).delete(Id);
			return res;
		} catch (err) {
			console.log(err);
		}
	};
}

module.exports = contenedorFirebase;
