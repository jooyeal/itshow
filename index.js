const express = require('express');
const socket = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socket(server);
const dataGet = require('./public/router/dataGet.js');
const dataPost = require('./public/router/dataPost.js');
const db = require('./public/lib/db');
db.connect();
app.use(dataGet);
app.use(dataPost);
app.set('view engine', 'pug');
app.set('views', './views');


io.sockets.on('connection', (socket) => {
    socket.on('joinroom', (data) => {
        socket.join(data.room);
        socket.room = data.room;
    });

    socket.on('newUser', (data) => {
        socket.name = data.name;
        io.sockets.in(data.room).emit('update', {
            type: 'connect',
            name: 'SERVER',
            message: 'hello' + data.name
        })
    });


    socket.on('message', (data) => {
        data.name = socket.name;
        socket.broadcast.to(data.room).emit('update', data);
    });


    socket.on('disconnect', () => {
        console.log(`${socket.name} is disconnected`);
        socket.broadcast.to(socket.room).emit('update', {
            type: 'disconnect',
            name: 'SERVER',
            message: `${socket.name} is disconnected`
        });
    });
});

server.listen(3000, () => {
    console.log('Express App on port 3000!');
});