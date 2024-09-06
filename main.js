const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const lastMessages = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (message) => {
        lastMessages[socket.id] = message;
        console.log(message)
        io.emit('chat message', lastMessages[socket.id]);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        delete lastMessages[socket.id];
    });

    // socket.on('admin-connect', () => {
    //     socket.emit('last-messages', lastMessages);
    // });

    setInterval(() => {
        socket.emit('last-messages', { array: ensureArray(lastMessages) });
    }, 100)


});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

function ensureArray(input) {
    if (!Array.isArray(input)) {
        return [input];
    } else {
        return input;
    }
}
