
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const moment = require('moment');
const formatMsg = require('./utils/messages');
const {userJoin, getCurrentUser, getCurrentUserByName, users} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;



String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 



app.use(express.static(path.join(__dirname, 'public')));

//Run when a client connects
io.on('connection', socket=>{
  socket.on('joinRoom', ({username, room, color})=>{
    let name = username;
    userJoin(socket.id, username, room, color);

    //Welcome connecting user 
    socket.emit('message', formatMsg('Lord of DatKord', "Welcome to Datkord", "#d6a400"));

    //Broadcast when user connects (broadcasts to everyone except user that is connecting)
    socket.broadcast.emit('message', formatMsg('Lord of DatKord', name + ' has joined the chat', "#d6a400", "join"));

    //When user sends message
    socket.on('chatMessage', (msg)=>{
      const currentUser = getCurrentUser(socket.id);
      io.emit('message', formatMsg(currentUser.username, msg, currentUser.color, "msg"));
    });

    //When user dsc
    socket.on('disconnect', ()=>{
      io.emit('message', formatMsg('Lord of DatKord', name + ' has left the chat', "#d6a400", "leave"));
    });
    
    socket.on('command', (msgObject)=>{
      const currentUser = getCurrentUser(socket.id);
      let cmd = msgObject.msg.toLowerCase().split(' ')[0];
      let arg = msgObject.msg.split(' ')[1];
      if(arg!=undefined){
        arg = arg.replaceAll('-', ' ');
      }

      switch(cmd){
        case '!hi':
          socket.emit('message', formatMsg('Lord of DatKord', "Hi " + msgObject.username + "!", "#d6a400", "msg")); 
          break;
                
        case '!nick':
          if(arg!=undefined){
            if(arg!='Lord of DatKord'){
              currentUser.username = arg;
              username=arg;
              socket.emit('changeNick', arg);
              socket.emit('message', formatMsg('Lord of DatKord', 'changing nickname to ' + arg + "...", "#d6a400", "msg"));   
            } else{
              socket.emit('message', formatMsg('Lord of DatKord', "Hey! That's my name!", "#d6a400", "msg"));   
            }
          }
          break;

        case '!shrug':
          io.emit('message', formatMsg(currentUser.username, "¯\\_(ツ)_/¯", currentUser.color, "msg"));
          break;
        
        // case '!member-count':
        //   io.emit('message', formatMsg('Lord of DatKord', users.length, "#d6a400", "msg"));
        //   break;
        default: 
          socket.emit('message', formatMsg('Lord of DatKord', 'Error: no such command: ' + cmd, "#d6a400", "msg")); 
      }
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
