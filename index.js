const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Store username when the client sends it
    socket.on("set username", (username) => {
        socket.username = username; // Store username in socket session
        console.log(`${username} has joined`);

        // This is my addition here to broadcast when a new person joins in on chat!
        socket.broadcast.emit('user joined', username);
    });

    // Handle chat messages
    socket.on('chat message', (data) => {
        console.log(`${data.username}: ${data.message}`);
        io.emit('chat message', data); // Send message with username
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`${socket.username || "A user"} disconnected`);
    });
});

server.listen(3000, () => {
    console.log('Listening on *:3000');
});