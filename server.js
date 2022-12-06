const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = 8800;

/*const { createCanvas } = require('canvas')
const canvas = createCanvas(1200, 800);
const ctx = canvas.getContext('2d');

let Whiteboard = require('./serverwhiteboard.js');

const whiteboard = new Whiteboard();*/
/*
    TODO:
    client connect to server
    server send canvas data to client
    client send draw data as object to server
    server send draw data to every other client and store draw data
*/

let canvas = {
    data: []
};

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('canvas', canvas);
    socket.on('canvas', (canvasData) => {
        canvas.data.push(canvasData);
        socket.broadcast.emit('canvas', {
            data: [canvasData]
        });
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});