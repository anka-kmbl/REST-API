const User = require('../models/user');
const jwt = require('jsonwebtoken');
const credentials = require('../config/credentials');
const userService = require('../services/userService');
const updateUser = userService.updateUser;

module.exports = function (req, res, next) {
	let bearerToken = req.headers['authorization'];
	if(!bearerToken) { 
		console.log('no token');
		return res.redirect('/');
	}
	req.token = bearerToken.split(' ')[1];
	checkIfTokenIsExpired(req.token)
		.then((result) => {
			if(!result) {
				console.log('token is expired');
				return res.status(401).end('token is expired, sign in again');
			} 
			checkIfTokenFitsUser(req.token)
			.then((userData) => {
				if(!userData) {
					console.log('should sign in again');
					return res.status(401).send('invalid token. you should sign in again');
				} else {
					console.log('token was prolonged');
					console.log(userData);
					req.user = userData;
					next();
				}
			})
		}) 
		.catch((err) => {
			throw err;
		});
}

function checkIfTokenIsExpired(token) {
	return new Promise((res, rej) => {
		let decodedToken = jwt.decode(token);
		console.log(decodedToken);
		let createdAt = decodedToken.createdAt;
		console.log(createdAt);
		console.log(Date.now());
		// console.log(`date diff ${(Date.now() - createdAt)/1000} s`);
		if((Date.now() - createdAt) > (10 * 60 * 1000)) {
			console.log('expired token. making it null..');

			updateUser({"token" : token}, {$set : {"token": null}})
				.then((numAffectedDocs) => {
					console.log(numAffectedDocs);
					res(false);
				})
				.catch((err) => {
					throw err;
				});
		} else {
			res(true);
		}
		
	});
	
}

function checkIfTokenFitsUser(token) {
	let username = jwt.decode(token).username;
	return new Promise((res, rej) => {
		User.findOne({
			username: username,
			token: token
		}, (err, user) => {
			if(err) {
				rej(err);
			}
			if(!user) {
				console.log('invalid token');
				res(false);
			} else {
				console.log('token prolongation...');
				prolongToken(user)
					.then((userData) => {
						console.log(userData);
						res(userData);
					})
					.catch((err) => {
						throw err;
					});	
			}
		});
	});
}

function prolongToken(user) {
	return new Promise((res, rej) => {
		let oldCreationDate = jwt.decode(user.token).createdAt;
		console.log(`oldcreationdate ${oldCreationDate}`);
		let newToken = jwt.sign({
			username: user.username,
			createdAt: oldCreationDate + (10 * 60 * 1000),
		}, process.env.SECRET || credentials.jwtSecret);

		updateUser({"username": user.username}, {$set: {"token": newToken}})
			.then((numAffectedDocs) => {
				console.log(numAffectedDocs);
				res( {
					type: true,
					username: user.username,
					usernameType: user.username_type,
					token: newToken,
				});
			});
	});
	
}