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
        socket.emit('sendMessage', generateMessage('System','Welcome'));
        socket.broadcast.to(user.room).emit('sendMessage', generateMessage(` ${user.username} has joined! `));
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUserInARoom(user.room),
        });

        callback();
    })

    // send message
    socket.on('sendMessage', (value, callback) => {
        const user = getUser(socket.id);
        const filter= new Filter();

        if (filter.isProfane(value)) {
            return callback(' Bad words not allowed');
        }

        io.to(user.room).emit('sendMessage',generateMessage(user.username, value));
        callback();
    })
    
    // disconnect 
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('sendMessage',generateMessage('System',`${user.username} has left!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUserInARoom(user.room),
            })
        }
    })
    
    // send location
    socket.on('sendLocation', ({longitude,latitude}, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocation(user.username, `https://google.com/maps?q=${longitude},${latitude}`));
        callback();
    })
})

server.listen( port, () => {
    console.log('server is up!')
})