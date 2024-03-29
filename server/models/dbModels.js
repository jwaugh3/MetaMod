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
    refresh_token: String,
    last_sign_in: Date
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

const moderationRecordSchema = new Schema({
    channel: String,
    mod: String,
    timestamp: Date,
    type: String,
    event: Object,
    created_by: String
})

const ModerationRecord = mongoose.model('moderation_records', moderationRecordSchema)

const clipRewind2020Schema = new Schema({
    channel: String,
    twitch_ID: String,
    clips: [Object]
})

const ClipRewind2020 = mongoose.model('clip_rewind_2020', clipRewind2020Schema)

const clipUserSchema = new Schema({
    twitch_ID: String, 
    login_username: String,
    display_name: String,
    broadcaster: String,
    profile_image: String,
    email: String,
    user_token: String,
    refresh_token: String,
    last_sign_in: Date
})

const ClipRewindUser = mongoose.model('clip_rewind_users', clipUserSchema)

module.exports = {
    User,
    ChannelAccess,
    BttvEmote,
    FfzEmote,
    ModerationRecord,
    ClipRewind2020,
    ClipRewindUser
}