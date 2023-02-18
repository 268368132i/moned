const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronProp = {
    send: (data) => {
        ipcRenderer.send('toMain', data);
    },
    receiveOn: (func) => {
        ipcRenderer.on('fromMain', func);
    },
    receiveOffAll: () => {
        ipcRenderer.removeAllListeners('fromMain');
    }
};
contextBridge.exposeInMainWorld("electron", electronProp);