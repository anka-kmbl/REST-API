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
			console.log('in cb');
			if(user) {
				result = {
					type: false,
					data: 'User already exists',
				};
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
						user.token = jwt.sign({
							username: user.username,
						}, process.env.SECRET || credentials.jwtSecret);
						return user;
					})
					.then((userWithToken) => {
						userWithToken.save()
							.then((savedUser) => {
								result = {
									type: true,
									data: savedUser,
									token: savedUser.token,
								};
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
				console.log('no user');
				res({info: 'No such user'});
			} else if(!user.passIsValid(req.body.password)) {
				res({info: 'invalid pass'});
			} else {
				res({
					type: true,
					data: user,
					token: user.token,
				});
			}
		});
	});

}

module.exports.getInfo = (token) => {
	return new Promise((res, rej) => {
		User.findOne({
			token: token
		}, (err, user) => {
			if(err) {
				throw err;
			}
			if(!user) {
				console.log('invalid token');
				return res({info: 'Invalid token'});
			}
			return res({
				id: user.username,
				type_id: user.username_type,
			});
		});
	});
}


function checkUsernameType(name) {
	let telRegex = /\+?[0-9]*(\(?[0-9]+\))?[0-9]+/g;
	if(name.match(telRegex)) {
		return 'phone';
	}
	return 'email';
}
