const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const PORT = 8800;

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

client.connect(err => {
    const collection = client.db("whiteboard").collection("boards");
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

    app.get('/whiteboard/:board', (req, res) => {
        res.sendFile(__dirname + '/whiteboard.html');

    });

    app.get('/createboard', (req, res) => {
        collection.insertOne({ lines: [] })
            .then(result => {
                res.send(result.insertedId);
            });
    });

    io.on('connection', (socket) => {
        console.log('a user connected');
        let boardName = socket.handshake.headers.referer.split('/').at(-1);
        socket.join(boardName);
        // Create catch here for when user connects to a board that doesn't exist
        collection.findOne({ _id: ObjectId(boardName) })
            .then(result => {
                socket.emit('board', result.lines);
            });

        socket.on('board', (board) => {
            collection.updateOne({ _id: ObjectId(board.name) }, { $push: { lines: board.line } });
            socket.broadcast.to(board.name).emit('board', [board.line]);
        });
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
});

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});