
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const moment = require('moment');
const formatMsg = require('./utils/messages');
const {userJoin, getCurrentUser} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

//Run when a client connects
io.on('connection', socket=>{
  socket.on('joinRoom', ({username, room, color})=>{

    userJoin(socket.id, username, room, color);

    //Welcome connecting user 
    socket.emit('message', formatMsg('Lord of DatKord', "Welcome to Datkord", "#d6a400"));

    //Broadcast when user connects (broadcasts to everyone except user that is connecting)
    socket.broadcast.emit('message', formatMsg('Lord of DatKord', username + ' has joined the chat', "#d6a400", "join"));

    //When user sends message
    socket.on('chatMessage', (msg)=>{
      const currentUser = getCurrentUser(socket.id);
      io.emit('message', formatMsg(currentUser.username, msg, currentUser.color, "msg"));
    });

    //When user dsc
    socket.on('disconnect', ()=>{
      io.emit('message', formatMsg('Lord of DatKord', username + ' has left the chat', "#d6a400", "leave"));
    });
    
  });
});

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}



server.listen(PORT, ()=>console.log('ChatRoom server running at port: ' + PORT));
