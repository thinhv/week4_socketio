'use strict';

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {transports: ['websocket', 'polling']});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('add user', (data) => {
    socket.username = data
    socket.emit('login', { numUsers: socket.client.conn.server.clientsCount })
    socket.broadcast.emit('user joined', {username: socket.username})
  });

  socket.on('disconnect', (reason) => {
    socket.broadcast.emit('user left', {username: socket.username})
  });

  socket.emit('chat message', 'hi there!');

  socket.on('new message', (msg) => {
    socket.broadcast.emit('new message', {username: socket.username, message: msg});
  });

  socket.on('typing', (msg) => {
    socket.broadcast.emit('typing', {username: socket.username});
  })

  socket.on('stop typing', (msg) => {
    socket.broadcast.emit('stop typing', {username: socket.username})
  })

  socket.conn.on('packet', (packet) => {
    if (packet.type === 'ping') console.log('received ping', packet);
  });

  socket.conn.on('packetCreate', (packet) => {
    if (packet.type === 'pong') console.log('sending pong', packet);
  });
});

http.listen(3000, () => {
  console.log('listening on port 3000');
});
