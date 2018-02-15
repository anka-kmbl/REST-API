const express = require('express');
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const session = require('session');
const mongoose = require('mongoose');
const dbUrl = require('./config/database').url;
const app = express();

mongoose.connect(dbUrl);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
	next();
});

const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/user');
const features = require('./routes/features');

app.use('/', indexRoutes);
app.use('/', userRoutes);
app.use('/', features);


module.exports = app;