const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	console.log('before redirect');
	res.redirect('/signin');
});

module.exports = router;