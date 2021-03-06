const path = require('path');
const htmlPath = path.resolve(__dirname, '../public', 'html');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const credentials = require('../config/credentials');

module.exports.getPath = (filename) => {
	return path.join(htmlPath, filename);
}

module.exports.performSignUp = (req) => {
	return new Promise((res, rej) => {
		User.findOne({
			username: req.body.userId
		}, (err, user) => {
			console.log(user);
			if(user) {
				res({
					type: false,
					data: 'User already exists',
				});
			} else {
				user = new User();
				user.username = req.body.userId;
				user.username_type = checkUsernameType(req.body.userId);
				user.createHash(req.body.password)
					.then((hash) => {
						user.password = hash;
						return user.save();
					})
					.then((user) => {
						user.token = createToken(user);
						return user;
					})
					.then((userWithToken) => {
						userWithToken.save()
							.then((savedUser) => {
								res({
									type: true,
									username: savedUser.username,
									usernameType: savedUser.username_type,
								});
							});
					})
					.catch((err) => {
						throw err;
					});
			}
		});
	})
	
}

module.exports.performSignIn = (req) => {
	
	return new Promise((res, rej) => {
		User.findOne({
			username: req.body.userId,
		}, (err, user) => {
			if(err) {
				rej(err);
			}
			if(!user) {
				res({info: 'No such user'});
			} else if(!user.passIsValid(req.body.password)) {
				res({info: 'invalid pass'});
			} else if(!user.token) {
				let newToken = createToken(user);
				updateUser({"username": user.username}, {$set: {"token": newToken}})
					.then((numAffectedDocs) => {
						res({
							type: true,
							username: user.username,
							usernameType: user.username_type,
							token: newToken,
						});
					})
			} else {
				res({
					type: true,
					username: user.username,
					usernameType: user.username_type,
					token: user.token,
				});
			}
		});
	});

}

module.exports.performLogOut = (token) => {
	return new Promise((res, rej) => {
		updateUser({"token": token}, {$set: {"token": null}})
			.then((numAffectedDocs) => {
				if(numAffectedDocs.nModified === 1) {
					res(true);
				} 
				res(false);
			})
			.catch((err) => {
				rej(err);
			})
	});
}


function createToken(user) {
	let date = Date.now();
	return jwt.sign({
		username: user.username,
		createdAt: date,
	}, process.env.SECRET || credentials.jwtSecret);
}

function checkUsernameType(name) {
	let telRegex = /\+?[0-9]*(\(?[0-9]+\))?[0-9]+/g;
	if(name.match(telRegex)) {
		return 'phone';
	}
	return 'email';
}

function updateUser(conditions, update) {
	return new Promise((res, rej) => {
		User.update(conditions, update, (err, modifiedDocs) => {
			if(err) {
				rej(err);
			}
			res(modifiedDocs);
		});
	});
}

module.exports.updateUser = updateUser;

