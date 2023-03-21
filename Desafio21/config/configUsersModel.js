const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const UsuarioSchema = new mongoose.Schema({
	idEmail: { type: String, required: true, max: 100 },
	username: { type: String, required: true, max: 100 },
	password: { type: String, required: true, max: 100 },
	name: { type: String, required: true, max: 100 },
	surname: { type: String, required: true, max: 100 },
	age: { type: Number, required: true, max: 999 },
	alias: { type: String, max: 100 },
	phoneNumber: { type: String, required: true, max: 100 },
	avatar: { type: String, required: true },
});
UsuarioSchema.plugin(findOrCreate);

const Usuarios = mongoose.model('usuarios', UsuarioSchema);
module.exports = Usuarios;
