let users = [];

function userJoin(id, username, room, color){
  users.push({id, username, room, color})
  return {id, username, room, color};
}

function getCurrentUser(id){
  return users.find((user)=>user.id === id);
}

module.exports = {userJoin, getCurrentUser};