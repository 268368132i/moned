import type { FrontendMessage, BackendMessage } from "../types/Communication.js";
import type { IpcMainEvent } from 'electron'

export async function initializeIpc(ipcMain) {
    ipcMain.on('toMain', (electronEvent: IpcMainEvent, incoming: FrontendMessage) => {
        console.log('received in main', incoming)
        const reply: BackendMessage = {
            id: incoming.id,
            data: { xxx: 'answer ipc' }
        }
        electronEvent.sender.send('fromMain', reply)
        // ipcMain.emit('fromMain', reply)
    })
}