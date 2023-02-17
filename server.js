const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/board', (req, res) => {
    res.sendFile(__dirname + '/board.html');
});

app.get('/typepad', (req, res) => {
    res.sendFile(__dirname + '/numberpad.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

app.get('/number', (req, res) => {
    res.send(__dirname+'./board.html');
});

// Using app.listen(3000) will not work here, as it creates a new HTTP server.
server.listen(3000);

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// });