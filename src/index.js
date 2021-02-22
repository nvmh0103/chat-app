const express=require('express');
const path= require('path');
const http= require('http');
const socketio= require('socket.io')

const app=express();
const server= http.createServer(app);
const io= socketio(server);

const port= process.env.PORT || 3000;

const publicDirectoryPath= path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath));

let count=0;

io.on('connection', (socket) => {
    console.log('new connection!')
    // socket.emit('countUpdated',count)

    // socket.on('increment', () => {
    //     count++;
    //     // socket.emit('countUpdated',count);
    //     io.emit('countUpdated', count);
    // })
    socket.emit('sendMessage', ' Welcome!');
    socket.broadcast.emit('sendMessage', ' new user has joined!');

    socket.on('sendMessage', (value) => {
        io.emit('sendMessage',value);
    })
    
    socket.on('disconnect', () =>{
        io.emit('sendMessage','A user has left!');
    })
})

server.listen( port, () => {
    console.log('server is up!')
})