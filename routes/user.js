const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/signup', userController.getSignUpPage);

router.post('/signup', userController.signUp);

router.get('/signin', userController.getSignInPage);

router.post('/signin', userController.signIn);

module.exports = router;