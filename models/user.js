const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = require('../config/credentials').saltRounds;
const Schema = mongoose.Schema;

let UserSchema = new Schema({
	username: String,
	username_type: String,
	password: String,
	token: String,
});

UserSchema.methods.createHash = (plainTextPass) => {
	return bcrypt.hash(plainTextPass, saltRounds)
		.then((hash) => {
			return hash;
		})
		.catch((err) => {
			throw err;
		})
}

UserSchema.methods.passIsValid = function(pass) {
	return bcrypt.compareSync(pass, this.password);
}

module.exports = mongoose.model('User', UserSchema);

