const socket = io();
const chatForm = document.getElementById('chat-form');
const messageContainer = document.getElementById('chat-messages');
const audioPlayer = document.getElementById("myAudio"); 

function playAudio() { 
  audioPlayer.play(); 
} 

//get Username and room from url
const username = location.href.split('?')[1].split('&')[0].split('=')[1].replace('+', '');
const room = location.href.split('?')[1].split('&')[1].split('=')[1].replace('+', '');

//Join chatroom
socket.emit('joinRoom', {username, room});

chatForm.addEventListener('submit', (e)=>{
  //prevent the form from submiting text to a file
  e.preventDefault();
  let msg = e.target.elements.msg.value;
  e.target.elements.msg.value = "";
  socket.emit('chatMessage', msg);
});

socket.on('message', (msg)=>{
  if(msg.username!=username){
    playAudio();
  }

  if(msg.msg.length>300){
    msg.msg = "your message was so long i will not read it - Lord of Datkord"
  }
  createMessage(msg);
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

function createMessage(msg){
  let newMessage = document.createElement('div');
  newMessage.classList.add('message');
  console.log(msg.color);
  newMessage.innerHTML = 
  `<p style="color: ${msg.color}" class="meta">${msg.username} - <span>${msg.time}</span> <span style="display:block"class="text">${msg.msg}</span></p>`
  messageContainer.appendChild(newMessage);
}

