const router = require('express').Router();
const queryString = require('querystring');
const request = require('request');
const { User, ChannelAccess } = require('../models/dbModels');
const server = require('../bot/bot.js')
const { client, updateOpts } = require('../bot/bot');
const { getBttvChannelEmotes, updateBttvChannelEmotes } = require('../utils/emotes/bttv');
const { getFfzChannelEmotes, updateFfzChannelEmotes } = require('../utils/emotes/ffz');
const { manageChannelAccess } = require('../utils/authFlow/manageChannelAccess')
const cookieParser = require('cookie-parser');
const cryptoJS = require('crypto-js');
const randomString = require('randomstring');

const REDIRECT_URI = process.env.BACK_END_URL + '/auth/redirected';
const LOGGED_IN_URI = process.env.FRONT_END_URL + '/dashboard';
const LOGGED_OUT_URI = process.env.FRONT_END_URL + '/login';
const OAUTH_URI = process.env.BACK_END_URL + '/auth/login';
const HOME_URI = process.env.FRONT_END_URL + '/home'

//handles redirect user to twitch's authentication login
router.get('/login', (req, res) => {
	res.redirect(
		'https://id.twitch.tv/oauth2/authorize?' +
			queryString.stringify({
				client_id: process.env.TWITCH_CLIENT_ID,
                redirect_uri: REDIRECT_URI,
                response_type: 'code',
				scope: 'user:read:email moderation:read channel:moderate',
                state: process.env.TWITCH_AUTH_STATE
			})
	);
});


router.get('/userCheck', (req, res)=>{
	//set variables
	let savedCookie = req.cookies.MM01;

	//if the cookie exists, attempt to find in DB
	if (savedCookie) {
		let retrievedToken = decryptUserToken(savedCookie);

		//search for user, if not found then clear cookie
		User.findOne({ user_token: retrievedToken }).then((result) => {

			if (!result) {
				console.log('error with cookie');
				res.clearCookie("MM01")
				res.redirect(LOGGED_OUT_URI);
			} else {
				let refreshToken = result.refresh_token;
				let twitchID = result.twitch_ID
				generateNewAccessToken(refreshToken).then((res) => JSON.parse(res)).then((data) => {
					res.redirect(LOGGED_IN_URI + '?twitch_id=' + twitchID);
				});
			}
		});
	} else {
		res.redirect(HOME_URI);
	}
})


//handles new and existing user login
router.get('/redirected', (req, res) => {

	//set variables
	var code = req.query.code;
	let state = req.query.state; 
	
	if(state !== process.env.TWITCH_AUTH_STATE){
		res.redirect(LOGGED_OUT_URI)
		return
	}
    
    var options = {
        'method': 'POST',
		'url': `https://id.twitch.tv/oauth2/token?` +
				queryString.stringify({
					client_id: process.env.TWITCH_CLIENT_ID,
					redirect_uri: REDIRECT_URI,
					client_secret: process.env.TWITCH_CLIENT_SECRET,
					grant_type: 'authorization_code',
					code: code
				})
      };

	request(options, (err, result, body) => {
		let bodyObject = JSON.parse(body)
		var accessToken = bodyObject.access_token
		var refreshToken = bodyObject.refresh_token;
		console.log(accessToken)

		var headers = {
			'Authorization': 'Bearer ' + accessToken,
			'Client-Id': process.env.TWITCH_CLIENT_ID
		}; 

		var userOptions = {
			url: 'https://api.twitch.tv/helix/users',
			headers: headers
		} 

		request(userOptions, (err, result, body) => {
			let userObject = JSON.parse(body).data 
			let twitch_ID = userObject[0].id
			

			User.findOne({ twitch_ID }).then((existingUser) => {

				if (existingUser) {
					//user exists
					console.log('existing user:', existingUser.display_name);

					//updates mods for channel access
					manageChannelAccess(existingUser.login_username)

					//update channel emotes
					updateBttvChannelEmotes(existingUser.twitch_ID, existingUser.login_username)
					updateFfzChannelEmotes(existingUser.twitch_ID, existingUser.login_username)

					User.findOneAndUpdate({twitch_ID}, {last_sign_in: new Date()}, {new: true, useFindAndModify: false})
					.then((res)=>{
						console.log(res)
					})

					// console.log('encrypt the following');
					res.cookie('MM01', encryptUserToken(existingUser.user_token), {
						maxAge: 345 * 24 * 60 * 60 * 1000,
						httpOnly: true 
					});

					res.redirect(LOGGED_IN_URI + '?twitch_id=' + twitch_ID);
				} else {
					//create new user 
					new User({ 
						twitch_ID: userObject[0].id.toString(), 
						login_username: userObject[0].login, 
						display_name: userObject[0].display_name, 
						broadcaster_type: userObject[0].broadcaster_type,
						profile_image: userObject[0].profile_image_url,
						email: userObject[0].email,
						user_token: generateUserToken(),
						refresh_token: refreshToken,
						last_sign_in: new Date()
					})
						.save() 
						.then((newUser) => {

							//have bot join channel
							updateOpts('add', [userObject[0].login])

							//get BTTV channel emotes
							getBttvChannelEmotes(userObject[0].id.toString(), userObject[0].login)

							//get FFZ channel emotes
							getFfzChannelEmotes(userObject[0].id.toString(), userObject[0].login)

							//check if channel access exists for user and mods and if not updates/creates
							manageChannelAccess(userObject[0].login)
							
							console.log('new user created: ' + newUser.twitch_ID);

							// console.log('encrypt the following');
							res.cookie('MM01', encryptUserToken(newUser.user_token), {
								maxAge: 345 * 24 * 60 * 60 * 1000,
								httpOnly: true
							});
						}) 
						.then(() => {
							res.redirect(LOGGED_IN_URI + '?twitch_id=' + twitch_ID);
						});
				}
			})
		}); 
	});
});


//--------------------------------------Functional Assets
generateNewAccessToken = async (refreshToken) => {
	//set variables
	// console.log(refreshToken);
	var options = {
        'method': 'POST',
		'url': `https://id.twitch.tv/oauth2/token?` +
				queryString.stringify({
					grant_type:'refresh_token',
					refresh_token: refreshToken,
					client_id: process.env.TWITCH_CLIENT_ID,
					client_secret: process.env.TWITCH_CLIENT_SECRET
				})
      };

	return new Promise((resolve, reject) => {
		request(options, (err, response, body) => {
			if (err) {
				reject(err);
			} else {
				console.log(body)
				resolve(body);
			}
		});
	});
};

generateUserToken = () => {
	const genUserToken = randomString.generate(32);
	return genUserToken;
};

encryptUserToken = (userToken) => {
	let encryptedToken = cryptoJS.AES.encrypt(userToken, process.env.COOKIE_KEY).toString();
	return encryptedToken;
};

decryptUserToken = (encryptedToken) => {
	let bytes = cryptoJS.AES.decrypt(encryptedToken, process.env.COOKIE_KEY);
	let userToken = bytes.toString(cryptoJS.enc.Utf8);
	return userToken;
};



module.exports = router;
