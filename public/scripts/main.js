const socket = io();
const chatForm = document.getElementById('chat-form');
const messageContainer = document.getElementById('chat-messages');
const msgSound = document.getElementById("msgSound"); 
const joinSound = document.getElementById("joinSound"); 
const leaveSound = document.getElementById("leaveSound"); 

msgSound.volume = 0.2;
joinSound.volume = 0.2;
leaveSound.volume = 0.2;
let previousMessageUser;

String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 



let username = location.href.split('?')[1].split('&')[0].split('=')[1].replaceAll('+', " ");
let color = location.href.split('?')[1].split('&')[1].split('=')[1].replace('%23', '#');
let room = location.href.split('?')[1].split('&')[2].split('=')[1].replace('+', ' ');

//Join chatroom
socket.emit('joinRoom', {username, room, color});

chatForm.addEventListener('submit', (e)=>{
  //prevent the form from submiting text to a file
  e.preventDefault();
  let msg = e.target.elements.msg.value;
  e.target.elements.msg.value = "";
  socket.emit('chatMessage', msg);
});

socket.on('message', (msg)=>{
  if(msg.username!=username){
    if(msg.msgType == "join"){
      joinSound.play();
    }else if(msg.msgType== "leave"){
      leaveSound.play();
    }else if(msg.msgType == 'msg'){
      msgSound.play();
    }
  }
  if(msg.msg.length>600){
    msg.msg = "your message was so long i will not read it - Lord of Datkord"
  }
  createMessage(msg);
  messageContainer.scrollTop = messageContainer.scrollHeight;
  previousMessageUser = msg.username;

  if(msg.msg[0]=='!'){
    socket.emit('command', msg);
  }
});

socket.on('changeNick', (arg)=>{
  console.log(arg);
  username = arg;
});


function createMessage(msg){
  let newMessage = document.createElement('div');
  newMessage.classList.add('message');

  if(previousMessageUser==msg.username){
    newMessage.innerHTML = 
    `<p class="meta"><span></span><span style="display:block"class="message-display">${msg.msg}</span></p>`  
  }else{
    newMessage.innerHTML = 
    `<p style="color: ${msg.color}; font-weight:bold;" class="meta">${msg.username} <span class="time-display">${msg.time}</span> <span style="display:block" class="message-display">${msg.msg}</span></p>`  
  }

  messageContainer.appendChild(newMessage);
}



function playSound(url) {
  var a = new Audio(url);
  a.play();
}
