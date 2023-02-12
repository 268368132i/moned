const {
    contextBridge,
    ipcRenderer
} = require("electron");
import type {ElectronProp} from '../types/Communication'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronProp: ElectronProp = {
    send: (data) => {
        ipcRenderer.send('toMain', data);
    },
    receive: (func) => {
        ipcRenderer.on('fromMain', func);
    }
};
contextBridge.exposeInMainWorld("electron", electronProp);