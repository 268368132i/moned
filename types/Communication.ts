import type { IpcRendererEvent } from "electron";

export type IncomingIpcHandler = (event: IpcRendererEvent, data: BackendMessage) => void

export type ElectronProp = {
    send: (data: unknown) => void;
    receiveOn: (handler: IncomingIpcHandler) => void;
    receiveOffAll: () => void;
}

export type BackendMessage = {
    id: string;
    err?: string;
    data?: unknown
}

export type FrontendMessage = {
    id: string;
    event: string;
    data?: unknown
}