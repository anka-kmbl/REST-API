const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const User = require('../models/user');
const path = require('path');
const htmlPath = path.resolve(__dirname, '../public', 'html');

router.get('/info', isLoggedIn, (req, res) => {
	User.findOne({
		token: req.token
	}, (err, user) => {
		if(err) {
			throw err;
		}
		if(!user) {
			console.log('invalid token');
			return res.redirect('/');
		}
		return res.json({
			id: user.username,
			type_id: user.username_type,
		})
	})
});

module.exports = router;