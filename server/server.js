const tmi = require('tmi.js');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const socket = require('./socket');
const bot = require('./bot/bot');
const updateBot = require('./bot/updateBot');
const { updateBttvGlobalEmotes } = require('./utils/emotes/bttv');
require('dotenv').config()


updateBttvGlobalEmotes()

//server setup
const app = express();
app.use(cors({ origin: process.env.FRONT_END_URL }));

const server = app.listen(process.env.PORT);
// const http = require('http').createServer(app);

//connect to mongodb
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (res) => {
	console.log('connected to mongodb');
});

// ------------------------------------------------------------------Authorization
//initialize cookie parser
app.use(cookieParser(process.env.COOKIE_KEY));

//cors setup
app.use(function(req, res, next) {
	// Website you wish to allow to connect
	res.header('Access-Control-Allow-Origin', process.env.FRONT_END_URL );

	// Request methods you wish to allow
	res.header('Access-Control-Allow-Methods', 'GET, POST');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

//authorization route
app.use('/auth', authRoutes);
app.use('/api', apiRoutes)

updateBot.getChannels()