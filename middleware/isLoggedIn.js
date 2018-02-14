module.exports = function (req, res, next) {
	let bearerToken = req.headers['authorization'];
	if(!bearerToken) { 
		console.log('no token');
		return res.redirect('/');
	}
	req.token = bearerToken.split(' ')[1];
	next();
}