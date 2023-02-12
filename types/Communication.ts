export type ElectronProp = {
    send: (data: unknown) => void
    receive: (handler: (data: BackendMessage) => void) => void
}

export type BackendMessage = {
    ack: number;
    err?: string;
    data?: unknown
}