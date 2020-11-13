const router = require('express').Router();
const queryString = require('querystring');
const keys = require('../config/keys');
const request = require('request');
const { User, ChannelAccess } = require('../models/dbModels');
const server = require('../bot/bot.js')
const { client } = require('../bot/bot');
const { getBttvChannelEmotes, updateBttvChannelEmotes } = require('../utils/emotes/bttv');
const { getFfzChannelEmotes, updateFfzChannelEmotes } = require('../utils/emotes/ffz');
const cookieParser = require('cookie-parser');
const cryptoJS = require('crypto-js');
const randomString = require('randomstring');

const REDIRECT_URI = 'http://localhost:5000/auth/redirected';
const LOGGED_IN_URI = 'http://localhost:3000/dashboard';
const LOGGED_OUT_URI = 'http://localhost:3000/login';
const OAUTH_URI = 'http://localhost:5000/auth/login';
const HOME_URI = 'http://localhost:3000/home'

//******************************************************************************************** MODIFY USE OF STATE */
//handles redirect user to twitch's authentication login
router.get('/login', (req, res) => {
	res.redirect(
		'https://id.twitch.tv/oauth2/authorize?' +
			queryString.stringify({
				client_id: keys.twitch.clientID,
                redirect_uri: REDIRECT_URI,
                response_type: 'code',
				scope:
                    'user:read:email moderation:read',
                state: keys.twitch.state
			})
	);
});


router.get('/userCheck', (req, res)=>{
	console.log('/HERE');
	//set variables
	let savedCookie = req.cookies.MM01;
	console.log(savedCookie);

	//if the cookie exists, attempt to find in DB
	if (savedCookie) {
		let retrievedToken = decryptUserToken(savedCookie);

		//search for user, if not found then clear cookie
		User.findOne({ user_token: retrievedToken }).then((result) => {
			console.log(result);
			if (!result) {
				console.log('error');
				res.clearCookie("MM01")
				res.redirect(LOGGED_OUT_URI);
			} else {
				let refreshToken = result.refresh_token;
				let twitchID = result.twitch_ID
				generateNewAccessToken(refreshToken).then((res) => JSON.parse(res)).then((data) => {
					console.log('data', data);
					res.redirect(LOGGED_IN_URI + '?access_token=' + data.access_token + '&twitch_id=' + twitchID);
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
	
	if(state !== keys.twitch.state){
		res.redirect(LOGGED_OUT_URI)
		return
	}
    
    var options = {
        'method': 'POST',
		'url': `https://id.twitch.tv/oauth2/token?` +
				queryString.stringify({
					client_id: keys.twitch.clientID,
					redirect_uri: REDIRECT_URI,
					client_secret: keys.twitch.clientSecret,
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
			'Client-Id': keys.twitch.clientID
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

					//update channel emotes
					updateBttvChannelEmotes(existingUser.twitch_ID, existingUser.login_username)
					updateFfzChannelEmotes(existingUser.twitch_ID, existingUser.login_username)

					console.log('encrypt the following');
					res.cookie('MM01', encryptUserToken(existingUser.user_token), {
						maxAge: 345 * 24 * 60 * 60 * 1000,
						httpOnly: true 
					});

					res.redirect(LOGGED_IN_URI + '?access_token=' + accessToken + '&twitch_id=' + twitch_ID);
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
						refresh_token: refreshToken
					})
						.save() 
						.then((newUser) => {

							//get BTTV channel emotes
							getBttvChannelEmotes(userObject[0].id.toString(), userObject[0].login)

							//get FFZ channel emotes
							getFfzChannelEmotes(userObject[0].id.toString(), userObject[0].login)

							//check if channel access exists for user and mods
							client.mods(userObject[0].login)
								.then((data)=>{
									console.log('data', data)
									//create login users channel access
									ChannelAccess.findOne({login_username: userObject[0].login}).then((existingLogin)=>{
										if(!existingLogin){
											new ChannelAccess({
												login_username: userObject[0].login,
												channel_access: [userObject[0].login]
											})
											.save()
											.then((user)=>{
												console.log('user', user)
											})
										} else {
											let newAccess = data
											newAccess.push(userObject[0].login)
											ChannelAccess.findOneAndUpdate({login_username: userObject[0].login}, {channel_access: newAccess}, {new: true, useFindAndModify: false})
										}
									})
									 
									//create or update all mods channel access
									data.forEach(async (mod)=>{
										console.log(mod)

										ChannelAccess.findOne({'login_username':mod}).then((userCheck)=>{
											if(userCheck && userCheck.channel_access.includes(userObject[0].login)){
												console.log('access already exists, no need to modify')
											} else {
												ChannelAccess.findOneAndUpdate({'login_username': mod}, {$push: {channel_access: userObject[0].login}}, {useFindAndModify: false}).then((user)=>{
													if(user){
														console.log('user', user)
													} else {
														new ChannelAccess({
															login_username: mod,
															channel_access: [mod, userObject[0].login]
														})
														.save()
														.then((newUser)=>{
															console.log(newUser)
														})
													}
												})
											}
										})
									})
								})  
								.catch((err)=>{
									console.log(err)
								})
							
							console.log('new user created: ' + newUser.twitch_ID);

							console.log('encrypt the following');
							res.cookie('MM01', encryptUserToken(newUser.user_token), {
								maxAge: 345 * 24 * 60 * 60 * 1000,
								httpOnly: true
							});
						}) 
						.then(() => {
							res.redirect(LOGGED_IN_URI + '?access_token=' + accessToken + '&twitch_id=' + twitch_ID);
						});
				}
			})
		}); 
	});
});


//--------------------------------------Functional Assets
generateNewAccessToken = async (refreshToken) => {
	//set variables
	console.log(refreshToken);
	var options = {
        'method': 'POST',
		'url': `https://id.twitch.tv/oauth2/token?` +
				queryString.stringify({
					grant_type:'refresh_token',
					refresh_token: refreshToken,
					client_id: keys.twitch.clientID,
					client_secret: keys.twitch.clientSecret
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
	console.log(userToken);
	let encryptedToken = cryptoJS.AES.encrypt(userToken, keys.session.cookieKey).toString();
	return encryptedToken;
};

decryptUserToken = (encryptedToken) => {
	let bytes = cryptoJS.AES.decrypt(encryptedToken, keys.session.cookieKey);
	let userToken = bytes.toString(cryptoJS.enc.Utf8);
	console.log('decrypted ', userToken);
	return userToken;
};



module.exports = router;