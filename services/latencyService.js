let request = require('request');

module.exports.measureLatency = () => {
	let start = Date.now();
	return new Promise((res, rej) => {
		request('http://www.google.com', (err, response, body) => {
			if(err) {
				rej(err);
			}
			let duration = Date.now() - start;
			res(duration);
		})
	});
}