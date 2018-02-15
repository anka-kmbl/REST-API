const latencyService = require('../services/latencyService');
const userService = require('../services/userService');

module.exports.getLatency = (req, res) => {
	
}

module.exports.getUserInfo = (req, res) => {
	userService.getInfo(req.token)
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			throw err;
		})
}	