import { Socket } from 'socket.io-client'

export class WSDBConnection {
  protected onConnect = () =>{}
  protected onDisconnect = () =>{}
  protected onData = (data: any) => {}
  connected: boolean = false
  constructor(protected socket: Socket, protected uri: string, protected name: string) {
    socket.on(name + '-status', (data) => {
      if (data.connected !== this.connected) {
        if (data.connected === true) {
          this.connected = true
          this.onConnect()
        } else {
          this.connected = false
          this.onDisconnect()
        }
      }
    })
    socket.on(name + '-data', this.onData)
  }
  connect(): void {
    if(this.connected) {
      return
    }
    this.socket.emit('dbconnect', {
      name: this.name,
      uri: this.uri
    })
  }
  disconnect():void {
    this.socket.emit('dbdisconnect', {
      name: this.name
    })
  }
  execute(script: string, name: string) {
    this.socket.emit('command', {
      name: name,
      execute: script
    })
  }
  setOnConnect(fn: ()=>void){
    this.onConnect = fn
  }
  setOnDisconnect(fn: ()=>void){
    this.onDisconnect = fn
  }
  setOnData(fn: (data: any) => void){
    this.onData = fn
  }
  isConnected() {
    return this.connected
  }
}