const latencyService = require('../services/latencyService');

module.exports.getLatency = (req, res) => {
	latencyService.measureLatency()
		.then((duration) => {
			return res.json({resource: 'google.com', requestDuration: `${duration}ms`, token: req.user.token});
		})
		.catch((err) => {
			throw err;
		});	
}

module.exports.getUserInfo = (req, res) => {
	res.json(req.user);
}	