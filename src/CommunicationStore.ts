import { io, Socket } from 'socket.io-client'
import { threadId } from 'worker_threads';
import type { BackendMessage, ElectronProp } from '../types/Communication';
// import { ipcRenderer } from 'electron';
// ipcRenderer.on('data', function (event,store) {
//     console.log(`data`, store);
// });

type EventHandlerArg = (data:unknown) => Promise<unknown>

const win = window as (typeof window & { electron?: ElectronProp } )

class CommunicationStore {
    type: 'IPC' | 'Socket.io';
    socket?: Socket;
    ackNum: number = 0;
    ipcAckHandlers: { [index: number]: undefined | {
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

    onIpcMessage(incomingMessage: BackendMessage) {
        const { err, data, ack } = incomingMessage;
        const ackHandler = this.ipcAckHandlers[ack];
        if (!ackHandler) {
            return;
        }
        
        if (err) {
            ackHandler.reject(new Error(err))
            return;
        }

        ackHandler.resolve(data);
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
            return new Promise((resolve, reject) => {
                // TODO register reject handler (call it on disconnect)
                this.socket?.emit('message', { event, data }, (err, incomingData) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(incomingData);
                });
            })
        }

        return {}
    }
    on(eventName: string, handler: EventHandlerArg) {

    }

    destroy() {
        console.log('destroy communication store')
        if (this.type === 'Socket.io') {
            this.socket?.disconnect();
            this.socket = undefined;
        }
    }
}
export default CommunicationStore;