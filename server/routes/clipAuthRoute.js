const router = require('express').Router();
const queryString = require('querystring');
const request = require('request');
const { ClipRewindUser } = require('../models/dbModels');
const server = require('../bot/bot.js')
const { client, updateOpts } = require('../bot/bot');
const cryptoJS = require('crypto-js');
const randomString = require('randomstring');

// const REDIRECT_URI = process.env.BACK_END_URL + '/clipAuth/redirectedToClips';
const REDIRECT_URI = process.env.BACK_END_URL + '/clipAuth/redirectedToClips';
const LOGGED_IN_URI = process.env.FRONT_END_URL + '/ClipRewind';
const LOGGED_OUT_URI = process.env.FRONT_END_URL + '/ClipRewindLogin';

//handles redirect user to twitch's authentication login
router.get('/clipRewindLogin', (req, res) => {
	res.redirect(
		'https://id.twitch.tv/oauth2/authorize?' +
			queryString.stringify({
				client_id: process.env.TWITCH_CLIENT_ID, 
                redirect_uri: process.env.BACK_END_URL + '/clipAuth/redirectedToClips',
                response_type: 'code',
				scope: 'user:read:email moderation:read',
                state: process.env.TWITCH_AUTH_STATE
			})
	);
});


//handles new and existing user login
router.get('/redirectedToClips', (req, res) => {

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
			

			ClipRewindUser.findOne({ twitch_ID }).then((existingUser) => {

				if (existingUser) {
					//user exists
					console.log('existing user:', existingUser.display_name);

					ClipRewindUser.findOneAndUpdate({twitch_ID}, {last_sign_in: new Date()}, {new: true, useFindAndModify: false})
					.then((res)=>{
						console.log(res)
					})
                    res.redirect(LOGGED_IN_URI + '?user=' + existingUser.login_username)
				} else {
					//create new user 
					new ClipRewindUser({ 
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
                            console.log('new user created: ' + newUser.twitch_ID);
                            res.redirect(LOGGED_IN_URI + '?user=' + newUser.login_username)
						}) 
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
				// console.log(body)
				resolve(body);
			}
		});
	});
};

generateUserToken = () => {
	const genUserToken = randomString.generate(32);
	return genUserToken;
};


module.exports = router; 