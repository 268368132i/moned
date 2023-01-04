import { io } from 'socket.io-client'
// import { ipcRenderer } from 'electron';
// ipcRenderer.on('data', function (event,store) {
//     console.log(`data`, store);
// });
type ElectronProp = {

}
const win = window as (typeof window & { electron: ElectronProp } )

if (win.electron) {
    console.log(`Communication store will work via IPC`, win.electron)
} else {
    console.log(`Communication store will work via socket.io`)
}

const globalSocket = io('ws://localhost:3000')
export default globalSocket;