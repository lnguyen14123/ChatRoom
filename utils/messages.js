const moment = require('moment');

function formatMsg(username, msg, color){

  return {username, msg, time: (moment().format('h:mm a')), color};
}

module.exports = formatMsg;