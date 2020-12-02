const tmi = require('tmi.js');
const { passChatMsg } = require('../socket');
const { ModerationRecord } = require('../models/dbModels');
const { identity } = require('lodash');
require('dotenv').config()

// Define configuration options
const opts = {
    connection: {
        reconnect: true
    },
    identity: {
        username: "metamoderation",
        password: "6iofm69e6vsvktwq4bsje1vxkmkkp5"
    }
}

const client = new tmi.client(opts);

// Connect to Twitch:
client.connect()   

// Called every time a message comes in
const onMessageHandler = async (target, user, msg, self) => {
    if (self) { return; } // Ignore messages from the bot
    passChatMsg({
        channel: target.substring(1), 
        displayName: user['display-name'], 
        displayColor: user.color, 
        msg: msg, 
        subscriber: user.subscriber,
        mod: user.mod,
        emotes: user.emotes
    })
}

//saves timeout actions to db
client.on("timeout", (channel, username, reason, duration, userstate) => {
    let timestamp = new Date()

    new ModerationRecord({
        channel,
        mod: 'Twitch Client',
        timestamp,
        type: 'timeout',
        event: {
                username,
                userID: userstate['target-user-id'],
                duration
        },
        created_by: null
    })
    .save()
    .then((res)=>{
        console.log(res)
    })
});

//stores message deleted actions to db
client.on("messagedeleted", (channel, username, deletedMessage, userstate) => {
    let timestamp = new Date()

    new ModerationRecord({
        channel,
        mod: 'Twitch Client',
        timestamp,
        type: 'messagedeleted',
        event: {
                username,
                deletedMessage
        },
        created_by: null
    })
    .save()
    .then((res)=>{
        console.log(res)
    })
});

//stores ban actions to db
client.on("ban", (channel, username, reason, userstate) => {
    let timestamp = new Date()

    new ModerationRecord({
        channel,
        mod: 'Twitch Client',
        timestamp,
        type: 'ban',
        event: {
                username,
                userID: userstate['target-user-id']
        },
        created_by: null
    })
    .save()
    .then((res)=>{
        console.log(res)
    })
});

//store emoteonly action to db
client.on("emoteonly", (channel, enabled) => {
    let timestamp = new Date()

    new ModerationRecord({
        channel,
        mod: 'Twitch Client',
        timestamp,
        type: 'emoteonly',
        event: {
            status: enabled
        },
        created_by: null
    })
    .save()
    .then((res)=>{
        console.log(res)
    })

});

//store followersonly actions to db
client.on("followersonly", (channel, enabled, length) => {
    let timestamp = new Date()

    new ModerationRecord({
        channel,
        mod: 'Twitch Client',
        timestamp,
        type: 'followersonly',
        event: {
            status: enabled,
            duration: length
        },
        created_by: null
    })
    .save()
    .then((res)=>{
        console.log(res)
    })
});

//store slowmode actions to db
client.on("slowmode", (channel, enabled, length) => {
    let timestamp = new Date()

    new ModerationRecord({
        channel,
        mod: 'Twitch Client',
        timestamp,
        type: 'slowmode',
        event: {
            status: enabled,
            duration: length
        },
        created_by: null
    })
    .save()
    .then((res)=>{
        console.log(res)
    })
});



const updateOpts = (action, channels) => {

    if(process.env.BACK_END_URL === 'http://localhost:5000'){
        client.join('#jwaugh3')
        console.log('joined', 'jwaugh3')
    } else {
        if(action === 'add'){
            channels.forEach((channel, i) => {
                setTimeout(()=>{
                    client.join('#' + channel)
                    console.log('joined', channel)
                }, i * 3000)  
            })
        }
        if(action === 'remove'){
            opts.channels.slice(opts.channels.indexOf(channel), 1)
        }
    }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
console.log(`* Connected to ${addr}:${port}`);
}

// Register our event handlers (defined below)
client.on('chat', onMessageHandler);
client.on('connected', onConnectedHandler);

module.exports = {
    updateOpts,
    client
}