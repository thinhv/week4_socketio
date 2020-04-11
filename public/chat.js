'use strict';

const socket = io('ws://localhost:3000');

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  const inp = document.getElementById('msg');
  socket.emit('chat message', inp.value);
  inp.value = '';
});

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.innerHTML = msg;
  document.getElementById('messages').appendChild(item);
});


socket.on('ping', (msg) => {
  console.log('ping', msg);
});

socket.on('pong', (msg) => {
  console.log('pong', msg);
});

