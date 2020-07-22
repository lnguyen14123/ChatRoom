const moment = require('moment');

function formatMsg(username, msg, color, msgType){

  return {username, msg, time: (moment().format('h:mm a')), color, msgType};
}

 

module.exports = formatMsg;