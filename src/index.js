const express=require('express');
const path= require('path');
const http= require('http');
const socketio= require('socket.io');
const Filter= require('bad-words');
const { generateMessage, generateLocation }= require('./utils/message');
const { addUser, getUser, removeUser, getUserInARoom } = require('./utils/user');

const app=express();
const server= http.createServer(app);
const io= socketio(server);

const port= process.env.PORT || 3000;

const publicDirectoryPath= path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath));

let count=0;

io.on('connection', (socket) => {
    console.log('new connection!')
    
    // join room
    socket.on('join', ({ username, room }, callback) => {
        const {error, user} = addUser( {
            id: socket.id,
            username,
            room,
        });
        if (error){
            return callback(error);
        }

        socket.join(user.room);
        socket.emit('sendMessage', generateMessage('Welcome'));
        socket.broadcast.to(user.room).emit('sendMessage', generateMessage(` ${user.username} has joined! `));

        callback();
    })

    // send message
    socket.on('sendMessage', (value, callback) => {
        const filter= new Filter();

        if (filter.isProfane(value)) {
            return callback(' Bad words not allowed');
        }

        io.emit('sendMessage',generateMessage(value));
        callback();
    })
    
    // disconnect 
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('sendMessage',generateMessage(`${user.username} has left!`));
        }
    })
    
    // send location
    socket.on('sendLocation', ({longitude,latitude}, callback) => {
        io.emit('locationMessage', generateLocation(`https://google.com/maps?q=${longitude},${latitude}`));
        callback();
    })
})

server.listen( port, () => {
    console.log('server is up!')
})