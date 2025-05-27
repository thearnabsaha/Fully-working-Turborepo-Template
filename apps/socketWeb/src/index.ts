import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 4002 });
wss.on('connection', (socket) => {
    console.log('Connection established');
    socket.send('Server is sending this message');
    try {
        socket.on('message', (message) => {
            socket.send(message.toString())
        })
    } catch (error) {
        console.log(error);
    }
});

console.log('WebSocket server is running on ws://localhost:4002');