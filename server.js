const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = 8800;

let canvases = {};

//let lines = [];

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/whiteboard/:board', (req, res) => {
    //console.log(req.params);
    res.sendFile(__dirname + '/whiteboard.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    let boardName = socket.handshake.headers.referer.split('/').at(-1);
    socket.join(boardName);
    if(canvases[boardName]){
        socket.emit('canvas', canvases[boardName])
    }else{
        canvases[boardName] = [];
    }
    socket.on('canvas', (board) => {
        canvases[board.name].push(board.line);
        socket.broadcast.to(board.name).emit('canvas', [board.line]);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});