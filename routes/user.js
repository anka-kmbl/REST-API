const express = require('express');
const router = express.Router();
const path = require('path');
const htmlPath = path.resolve(__dirname, '../public', 'html');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const credentials = require('../config/credentials');
// router.use(express.static(path.resolve(__dirname, '../public', 'html')));


router.get('/signup', (req, res) => {
	res.sendFile(path.join(htmlPath, 'signup.html'));
});

router.post('/signup', (req, res) => {
	User.findOne({
		username: req.body.userId
	}, (err, user) => {
		console.log('in cb');
		if(user) {
			res.json({
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
				
				.catch((err) => {
					throw err;
				});
			
			user.save()
				.then((user) => {
					console.log('before creating a token');
					user.token = jwt.sign({
						username: user.username,
					}, process.env.SECRET || credentials.jwtSecret);
					return user;
				})
				.then((userWithToken) => {
					console.log('user with token');
					userWithToken.save()
						.then((savedUser) => {
							console.log('saved user');
							res.json({
								type: true,
								data: savedUser,
								token: savedUser.token,
							});
						})
						.catch((err) => {
							throw err;
						})
				})
				.catch((err) => {
					throw err;
				})
		}
	});

});

router.get('/signin', (req, res) => {
	console.log('in user signin router')
	res.sendFile(path.join(htmlPath, 'signin.html'));
});

router.post('/signin', (req, res) => {
	console.log(req.body);
	User.findOne({
		username: req.body.userId,
	}, (err, user) => {
		if(err) {
			throw err;
		}
		if(!user) {
			console.log('No such user');
			return res.sendFile(path.join(htmlPath, 'noUser.html'));
		}
		console.log(req.body.password);
		if(!user.passIsValid(req.body.password)) {
			console.log('invalid pass');
			return res.redirect('/signin');
		}
		console.log('signed in');
		return res.json({
			type: true,
			data: user,
			token: user.token,
		});
		
	});
});

// function isLoggedIn(req, res, next) {
// 	let bearerToken = req.headers['authorization'];
// 	if(!bearerToken) { 
// 		console.log('no token');
// 		return res.redirect('/');
// 	}
// 	req.token = bearerToken.split(' ')[1];
// 	next();
// }

function checkUsernameType(name) {
	let telRegex = /\+?[0-9]*(\(?[0-9]+\))?[0-9]+/g;
	if(name.match(telRegex)) {
		return 'phone';
	}
	return 'email';
}

module.exports = router;