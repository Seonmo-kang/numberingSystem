const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');


//Path
const clientPath = path.join(__dirname,'public');
// .css files are static files. you don't serve static files as an express middleware
// Add following middleware to serve
app.use(express.static(path.join(clientPath)));
// Add node_modules path for access toastify
app.use('/static', express.static('node_modules'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/board', (req, res) => {
    res.sendFile(clientPath + '/board.html');
});

app.get('/numberpad', (req, res) => {
    res.sendFile(clientPath + '/numberpad.html');
});

global.storeName = null;

io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(socket.id);
    //Request store name from board page to numberpad
    //if storename is null then print error
    socket.on('request_store_name',(data)=>{
        console.log("request_store_name from board page: ",storeName);
        if(storeName!=null)
            socket.broadcast.emit("send_storeName_to_board",storeName);
    });

    //Get number from numberpad page
    //Send to every socket to notify number
    socket.on('send_number', (data) =>{
        // socket contains number
        console.log("send_number function Test : ",data);
        socket.broadcast.emit("send_number_to_board",data);
    })
    //Get number from numberpad page
    //Send to every socket to delete number element
    socket.on('delete_number', (data) =>{
        // socket contains number, operation number
        console.log("delete_number function Test : ",data);
        socket.broadcast.emit("send_delete_number_to_board",data);
    })

    //Get store name from numberpad page
    //Send to every socket to change store name
    socket.on('send_storeName', (data)=> {
        console.log("send_storeName function Test : ",data);
        storeName = data;
        socket.broadcast.emit("send_storeName_to_board",data);

        console.log("storename is ",storeName);
    })
    socket.on('send_delete_all_orders',(data)=>{
        console.log('send_delete_all_orders :', data);
        socket.broadcast.emit("send_delete_all_orders_to_board",data);
    })

    socket.on('error',(error)=>{
        console.error(error);
    })

});

// Using app.listen(3000) will not work here, as it creates a new HTTP server.
server.listen(3000);

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// });