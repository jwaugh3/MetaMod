// const tmi = require('tmi.js');
const WebSocket = require('websocket').w3cwebsocket
const request = require('request');
const { connect } = require('mongoose');

var ws

// const opts = {
//     connection: {
//         reconnect: true,
//         secure: true
//     },
//     identity: {
//         username: "metamoderation",
//         password: "6iofm69e6vsvktwq4bsje1vxkmkkp5"
//     },
//     channels: ['#jwaugh3']
// }

// const client = new tmi.client(opts);

// // Connect to Twitch:
// client.connect()   

// // Called every time the bot connects to Twitch chat
// function onConnectedHandler (addr, port) {
// console.log(`* Connected to ${addr}:${port}`);
// }

// client.on('connected', onConnectedHandler);

// client.on("emoteonly", (channel, enabled) => {
//     console.log('emoteOnly set', channel, enabled)
// });

// client.on("ban", (channel, username, reason, userstate) => {
//     console.log('banned', channel, username, reason, userstate)
// });

// client.on("mod", (channel, username) => {
//     console.log('modded', channel, username)
// });

// client.on("raw_message", (messageCloned, message) => {
// 	var raw = JSON.stringify(message.raw);
// 	var tags = JSON.stringify(message.tags); //has 'notice' and more
// 	var prefix = JSON.stringify(message.prefix);
// 	var command = JSON.stringify(message.command);
//     var params = JSON.stringify(message.params);
//     if(message.tags['msg-id']){
//         console.log(message.tags)
//     }
// }); 

// client.on("timeout", (channel, username, reason, duration, userstate) => {
//     console.log(channel, username, reason, duration, userstate)
// });

listenTopic = () => {
    let message = {
        type: 'LISTEN',
        data: {
            topics: ['chat_moderator_actions.54592802.54592802'],
            auth_token: 'cfllxbdn7c0altijaimrplpiwig19c'
        }
    };

    ws.send(JSON.stringify(message))
}

heartbeat = () => {
    ping = {
        type: 'PING'
    }
    ws.send(JSON.stringify(ping))
}

pubSubConnect = () => {
    var heartbeatInterval = 1000 * 60; //ms between PING's
    var reconnectInterval = 1000 * 3; //ms to wait before reconnect
    var heartbeatHandle;

    ws = new WebSocket('wss://pubsub-edge.twitch.tv')

    ws.onopen = (event) => {
        console.log('ws connected')
        heartbeat()
    
        heartbeatHandle = setInterval(heartbeat, heartbeatInterval);
        listenTopic()
    }

    ws.onerror = (error) => {
        console.log(JSON.stringify(error))
    }

    ws.onmessage = (event) => {
        let message = JSON.parse(event.data)
        console.log(message)

        if (message.type == 'RECONNECT') {
            setTimeout(connect, reconnectInterval)
        }
    }

    ws.onclose = () => {
        clearInterval(heartbeatHandle)
        setTimeout(connect, reconnectInterval)
    }
}

// pubSubConnect()

// function connect() {
//     var heartbeatInterval = 1000 * 60; //ms between PING's
//     var reconnectInterval = 1000 * 3; //ms to wait before reconnect
//     var heartbeatHandle;

//     ws = new WebSocket('wss://pubsub-edge.twitch.tv');

//     ws.onopen = function(event) {
//         $('.ws-output').append('INFO: Socket Opened\n');
//         heartbeat();
//         heartbeatHandle = setInterval(heartbeat, heartbeatInterval);
//     };

//     ws.onerror = function(error) {
//         $('.ws-output').append('ERR:  ' + JSON.stringify(error) + '\n');
//     };

//     ws.onmessage = function(event) {
//         message = JSON.parse(event.data);
//         $('.ws-output').append('RECV: ' + JSON.stringify(message) + '\n');
//         if (message.type == 'RECONNECT') {
//             $('.ws-output').append('INFO: Reconnecting...\n');
//             setTimeout(connect, reconnectInterval);
//         }
//     };

//     ws.onclose = function() {
//         $('.ws-output').append('INFO: Socket Closed\n');
//         clearInterval(heartbeatHandle);
//         $('.ws-output').append('INFO: Reconnecting...\n');
//         setTimeout(connect, reconnectInterval);
//     };

// }



// module.exports = {
//     client
// }