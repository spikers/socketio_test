// import Hangout from '../models/hangout';
// import User from '../models/user';

module.exports = function (io) {
  //When it connects, everything begins
  io.on('connection', (socket) => {
    //Join the 'default' room
    socket.join('default');

    // Upon receiving the 'init', get the correct chat and set the user's first name
    socket.on('init', (userObject) => {
      socket.nickname = userObject.given_name;

      var room = 'default';
      console.log('joined: ', room);
      socket.join(room);
    })
    
    /**
     * @param {object} messageObject
     * Format: { 'room': roomID, 'message': <msg text here> }
     * Handle timestamps on server
     * Handle socket ID on server
     */
    socket.on('chat message', (messageObject) => {
      var room = getRoom(socket, io);
      var nickname = socket.nickname;
      console.log('room', room);

      io.to(room).emit('chat message', messageObject.given_name + ': ' + messageObject.message);

      // DUPE #1: Hangout Object
      // We duplicated data, so this is the first round of duplication, HANGOUT
    });

    // From chat.js, this is the thing that sends the 'Tim is typing...'
    socket.on('keypress', (messageObject) => {
      if (messageObject.message) {
        socket.to(getRoom(socket, io)).broadcast.emit('keypress', socket.nickname);
      } else if (!messageObject.message) {
        socket.to(getRoom(socket, io)).broadcast.emit('keypress', messageObject.message);
      }
    });

    // Future Proofing. Not currently used.
    socket.on('disconnect', (data) => {

    });

    // Used to leave current rooms and join a new room.
    socket.on('changeRoom', (data) => {
      if (data.roomName === getRoom(socket, io)) return;
      socket = leaveAllRooms(Object.keys(io.sockets.adapter.sids[socket.id]), socket);
      socket.join(data.roomName);
    });

    // Future Proofing. Just in case. Not used at all.
    socket.on('changeUserName', (data) => {
      socket.nickname = data.userName;
    });
  });
}

// Helper function to kill all the rooms before joining one. Reduces confusion
function leaveAllRooms(roomArray, socket) {
  for (var i = 0; i < roomArray.length; i++) {
    socket.leave(roomArray[i]);
  }
  return socket;
}

// Can't be accessed, future proofing.
function sendDisconnectionMessage(roomItem, socket) {
  socket.broadcast.to(roomItem).emit('chat message', socket.nickname + ' has disconnected!');
}

// Can't be accessed, future proofing
function sendConnectionMessage(room, socket) {
  socket.broadcast.to(room).emit('chat message', socket.nickname + ' has connected')
}

// Helper function to grab the room the user is in. Should only have one room. 
function getRoom(socket, io) {
  return Object.keys(io.sockets.adapter.sids[socket.id])[0];
}

// Helper function to format dates.
function getDate() {
  var newDate = new Date();
  var fullDate = newDate.getFullYear().toString();
  
  if (newDate.getMonth() + 1 < 10) {
    fullDate += 0;
  }
  fullDate += (newDate.getMonth() + 1).toString();

  if (newDate.getDate() < 10) {
    fullDate += 0;
  }
  fullDate += (newDate.getDate() + 1).toString();
  
  console.log('fullDate: ' + fullDate);
  return fullDate;
}

function parseJSON(input) {
  return JSON.parse(input);
}