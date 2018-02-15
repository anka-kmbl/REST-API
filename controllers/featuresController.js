const latencyService = require('../services/latencyService');
// const userService = require('../services/userService');

module.exports.getLatency = (req, res) => {
	
}

module.exports.getUserInfo = (req, res) => {
	console.log(`featuresController user info ${req.user}`);
	res.json(req.user);
}	