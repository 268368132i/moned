export type ElectronProp = {
    send: (data: unknown) => void
    receive: (handler: (event: unknown, data: BackendMessage) => void) => void
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