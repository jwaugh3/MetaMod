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
const path = require('path')
require('dotenv').config()

//server setup
const app = express();

//cors setup
app.use(cors({ origin: '*' }));
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

//initialize cookie parser
app.use(cookieParser(process.env.COOKIE_KEY));

//connect to mongodb
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (res) => {
	console.log('connected to mongodb');
	console.log(res)
});

//test endpoint
app.get('/test', (req, res)=>{ 
	res.send('its working')
})

//authorization route
app.use('/auth', authRoutes);
app.use('/api', apiRoutes)

//add user
updateBot.getChannels()

updateBttvGlobalEmotes()

const server = app.listen(process.env.PORT, process.env.LOCAL_HOST, ()=> {
	console.log('listening on port ' + process.env.PORT)
});

//test
