// const tmi = require('tmi.js');
// const WebSocket = require('websocket').w3cwebsocket

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

// // client.on("emoteonly", (channel, enabled) => {
// //     console.log('emoteOnly set', channel, enabled)
// // });

// // client.on("ban", (channel, username, reason, userstate) => {
// //     console.log('banned', channel, username, reason, userstate)
// // });

// client.on("mod", (channel, username) => {
//     console.log('modded', channel, username)
// });

// // client.on("raw_message", (messageCloned, message) => {
// // 	var raw = JSON.stringify(message.raw);
// // 	var tags = JSON.stringify(message.tags); //has 'notice' and more
// // 	var prefix = JSON.stringify(message.prefix);
// // 	var command = JSON.stringify(message.command);
// //     var params = JSON.stringify(message.params);
// //     if(message.tags['msg-id']){
// //         console.log(message.tags)
// //     }
// // });

// ws = new WebSocket('wss://pubsub-edge.twitch.tv')

// message = {
//     type: 'LISTEN',
//     data: {
//         topics: ['chat_moderator_actions.54592802.54592802'],
//         auth_token: 'eyetb7i9pmggzusjdzarno796pb068'
//     }
// };

// ws.onopen = () => {
//     console.log('ws connected')
//     ws.send(JSON.stringify(message));
// }

// ws.onmessage = (event) => {
//     console.log(JSON.parse(event.data))
// }




// module.exports = {
//     client
// }