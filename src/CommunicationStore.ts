import { io, Socket } from 'socket.io-client'
import { v4 as uuid4 } from 'uuid'
import type { BackendMessage, ElectronProp, FrontendMessage } from '../types/Communication';
// import { ipcRenderer } from 'electron';
// ipcRenderer.on('data', function (event,store) {
//     console.log(`data`, store);
// });

type EventHandlerArg = (data:unknown) => Promise<unknown>

const win = window as (typeof window & { electron?: ElectronProp } )

class CommunicationStore {
    type: 'IPC' | 'Socket.io';
    socket?: Socket;
    ipcAckHandlers: { [index: string]: undefined | {
        event: string;
        resolve: (data: unknown) => void;
        reject: (err: Error) => void;
    } } = {};

    socketAckHandlers: { [index:string]: undefined | {
        reject: (err: Error) => void;
        sendTime: number;
    }}

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
        this.socket = io('ws://localhost:3000');
        this.socket.on('connect', async () => {
            try {
                await this.emit('init', {})
            } catch (err) {
                console.error('error on init socket.io!');
                this.destroy();
                this.initSocketIo();
            }
        })
        this.socket.on('disconnect', (reason: string) => {
            console.log('socket.io disconnected');
            for (const key in this.socketAckHandlers) {
                this.socketAckHandlers?.[key]?.reject(new Error('disconnected'))
                delete this.socketAckHandlers?.[key];
            }
        })
        this.socketAckHandlers = {};
    }

    onIpcMessage(_event, incomingMessage: BackendMessage) {
        console.log('onIpcMessage',_event, incomingMessage)
        const { err, data, id } = incomingMessage;
        const ackHandler = this.ipcAckHandlers[id];
        delete this.ipcAckHandlers[id];
        if (!ackHandler) {
            return;
        }
        
        if (err) {
            ackHandler.reject(new Error(err))
            return;
        }

        ackHandler.resolve(data);
    }

    async initIpc() {
        if (!win.electron) return;
        win.electron.receive(this.onIpcMessage.bind(this))
        
        try {
            await this.emit('init', {})
        } catch (err) {
            console.error('error on init IPC!', err);
            // this is unexpected situation
        }
    }

    async emit(event: string, data: unknown): Promise<unknown> {
        if (this.type === 'IPC') {
            return new Promise((resolve, reject) => {
                if (!win.electron) return;
                const id = uuid4();
                this.ipcAckHandlers[id] = { event, resolve, reject };
                const message:FrontendMessage = {
                    event,
                    id,
                    data
                }
                win.electron.send(message)
            })
        } else if (this.type === 'Socket.io') {
            return new Promise((resolve, reject) => {
                if (!this.socket?.connected) {
                    reject(new Error('socket.io is not connected'));
                    return;
                }
                const key = uuid4();
                this.socketAckHandlers[key] = { reject, sendTime: (new Date()).getTime()}
                this.socket?.emit('message', { event, data }, (err, incomingData) => {
                    delete this.socketAckHandlers[key];
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