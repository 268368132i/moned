import { io } from 'socket.io-client'
import { ipcRenderer } from 'electron';
ipcRenderer.on('data', function (event,store) {
    console.log(`data`, store);
});
const globalSocket = io('ws://localhost:3000')
export default globalSocket;