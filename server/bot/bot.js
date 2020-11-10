const tmi = require('tmi.js');
const { passChatMsg } = require('../socket');

// Define configuration options
const opts = {
    identity: {
    username: "dynamo_bot",
    password: "dzfqleso5yhwb3r4tsaikfm8vnu1gs"
    }
}

const client = new tmi.client(opts);

// Connect to Twitch:
client.connect()   

// Called every time a message comes in
const onMessageHandler = async (target, user, msg, self) => {
    if (self) { return; } // Ignore messages from the bot
    console.log(user)
    passChatMsg({
        channel: target.substring(1), 
        displayName: user['display-name'], 
        displayColor: user.color, msg: msg, 
        subscriber: user.subscriber,
        mod: user.mod,
        emotes: user.emotes
    })
}

const updateOpts = (action, channels) => {
    if(action === 'add'){
        channels.map((channel)=>{
            client.join('#' + channel)
        })
    }
    if(action === 'remove'){
        opts.channels.slice(opts.channels.indexOf(channel), 1)
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