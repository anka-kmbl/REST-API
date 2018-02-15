const userService = require('../services/userService');

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
			res.json(result);
		})
		.catch((err) => {
			throw err;
		});
}

module.exports.logOut = (req, res) => {
	userService.performLogOut(req.body.token)
		.then((result) => {
			if(result) {
				return res.json({info:'logout was successfull'});
			} 
			return res.json({info:'could not log out, you are still signed in!'});
		})
		.catch((err) => {
			throw err;
		});
}