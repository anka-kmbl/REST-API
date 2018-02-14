const userService = require('../services/user');

module.exports.getSignUpPage = (req, res) => {
	res.sendFile(userService.getPath('signup.html'));
}

module.exports.signUp = (req, res) => {
	userService.performSignUp(req)
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			throw err;
		});
}

module.exports.getSignInPage = (req, res) => {
	res.sendFile(userService.getPath('signin.html'));	
}

module.exports.signIn = (req, res) => {
	userService.performSignIn(req)
		.then((result) => {
			console.log(`resp json ${result}`);
			res.json(result);
		})
		.catch((err) => {
			throw err;
		});
}