const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    twitch_ID: String, 
    login_username: String,
    display_name: String,
    broadcaster: String,
    profile_image: String,
    email: String,
    user_token: String,
	refresh_token: String
})

const User = mongoose.model('users', userSchema)


const channelAccessSchema = new Schema({
    login_username: String,
    channel_access: [String]
})

const ChannelAccess = mongoose.model('channel_accesses', channelAccessSchema)


const bttvSchema = new Schema({
    origin: String,
    channel_ID: String,
    channel_name: String,
    emotes: [Object]
})

const BttvEmote = mongoose.model('bttv_emotes', bttvSchema)

const ffzSchema = new Schema({
    origin: String,
    channel_ID: String,
    channel_name: String,
    emotes: [Object]
})

const FfzEmote = mongoose.model('ffz_emotes', ffzSchema)

module.exports = {
    User,
    ChannelAccess,
    BttvEmote,
    FfzEmote
}