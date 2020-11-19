import io from 'socket.io-client';

let socketConnection = ''
if(window.location.host !== 'localhost:3000'){
    socketConnection = 'https://api.metamoderation.com/socket'
} else {
    socketConnection = 'http://localhost:8888'
}

const socket = io("https://api.metamoderation.com", {
	path: '/socket'
});

export default socket;
