let users = [];

function userJoin(id, username, room, color){
  users.push({id, username, room, color})
  return {id, username, room, color};
}

function getCurrentUser(id){
  return users.find((user)=>user.id === id);
}

function getCurrentUserByName(name){
  return users.find((user)=>user.name === name);
}

function userLeave(id){
  let index = users.findIndex(user=>user.id===id);
  if(index!=-1){
    return users.splice(index, 1);
  }
}

function changeNick(id, newName){
  users.find((user)=>user.id === id).username = newName;
}



module.exports = {userJoin, getCurrentUser, getCurrentUserByName, users, userLeave, changeNick};