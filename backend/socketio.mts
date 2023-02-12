import { createServer } from 'http';
import { Server } from 'socket.io'

const httpServer = createServer();

console.log('server is starting...')

const socketIo = new Server(httpServer)
// Whenever someone connects this gets executed
socketIo.on('connection', function (socket) {
  console.log(`A user connected ${socket.id}`);
  socket.on('message', (data, cb) => {
    console.log('Socket message: ', data);
    cb(null, { answer: '123' })
  })
  socket.on('disconnect', () => {
    console.log(`user disconnected ${socket.id}`);
  })
})

const HOST = '127.0.0.1';
const PORT = 3001;
httpServer.listen(PORT, HOST, () => {
  console.log(`socket.io server is listening ${HOST} ${PORT}`)
})

