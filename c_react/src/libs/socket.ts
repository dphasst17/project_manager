import { io } from 'socket.io-client';

const socket = io(`${process.env.URL_SERVER}`);

export default socket;

