'use strict';

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {transports: ['websocket', 'polling']});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('disconnect', (reason) => {
    console.log('a user disconnected', socket.id);
    console.log('a user disconnected', reason);
  });

  socket.emit('chat message', 'hi there!');

  socket.on('chat message', (msg) => {
    console.log('message: ', msg);
    io.emit('chat message', msg);
  });

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
