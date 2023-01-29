const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "electron", {
        send: (data) => {
            ipcRenderer.send('toMain', data);
        },
        receive: (func) => {
            ipcRenderer.on('fromMain', func);
        }
    }
);