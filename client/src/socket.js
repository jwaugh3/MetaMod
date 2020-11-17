import io from 'socket.io-client';
const socket = io('https://api.metamoderation.com/socket');
export default socket;
