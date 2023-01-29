import { io, Socket } from 'socket.io-client'
// import { ipcRenderer } from 'electron';
// ipcRenderer.on('data', function (event,store) {
//     console.log(`data`, store);
// });

type EventHandlerArg = (data:unknown) => Promise<unknown>
type ElectronProp = {
    send: (data: unknown) => void
    receive: (handler: (data: BackendMessage) => void) => void
}
type BackendMessage = {
    ack: number;
    err?: string;
    data?: unknown
}
const win = window as (typeof window & { electron?: ElectronProp } )

class CommunicationStore {
    type: 'IPC' | 'Socket.io';
    socket?: Socket;
    ackNum: number = 0;
    ipcAckHandlers: { [index: number]: {
        event: string;
        resolve: (data: unknown) => void;
        reject: (err: Error) => void;
    } } = {};

    constructor () {
        if (win.electron) {
            this.type = 'IPC';
            console.log(`Communication store will work via IPC`, win.electron)
            this.initIpc();
        } else {
            this.type = 'Socket.io'
            console.log(`Communication store will work via socket.io`)
            this.initSocketIo();
        }

    }

    initSocketIo() {
        this.socket = io('ws://localhost:3000')
    }

    onIpcMessage(data: BackendMessage) {
        const ackHandler = this.ipcAckHandlers[data.ack]
    }

    initIpc() {
        if (!win.electron) return;
        win.electron.receive(this.onIpcMessage.bind(this))
    }

    async emit(event: string, data: unknown): Promise<unknown> {
        if (this.type === 'IPC') {
            return new Promise((resolve, reject) => {
                if (!win.electron) return;
                this.ackNum++;
                this.ipcAckHandlers[this.ackNum] = { event, resolve, reject }
                win.electron.send({
                    event,
                    ack: this.ackNum,
                    data
                })
            })
        } else if (this.type === 'Socket.io') {

        }

        return {}
    }
    on(eventName: string, handler: EventHandlerArg) {

    }
}
export default CommunicationStore;