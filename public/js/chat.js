var socket = io();

window.addEventListener('load', function () {
  //Gets the user immediately on page load, then uses the user object to create chat buttons and initialize
  var userObject = {
    given_name: 'Brian', 
    family_name: ''
  }

  socket.emit('init', userObject);
  initialize(userObject);
});

// This is starting us off in the right room and attaching a bunch of listeners.
function initialize(userObject) {
  var name = '';
  var room = 'default';

  var form = document.getElementById('form');

  form.addEventListener('submit', function (e) {
    submitMessage(e, socket, room, userObject);
  });

  // When the server sends a 'chat message', append it to the DOM
  socket.on('chat message', function (msg) {
    ulElement = document.getElementById('messages');
    var li = getElementFromText(msg, 'li');
    ulElement.appendChild(li);
    ulElement.scrollTop = ulElement.scrollHeight;
  });

  // 'join', I don't think is ever called. Delete this.
  socket.on('join', function (room) {
    socket.room = room;
    socket.join(room);
  })

  // This is for the 'Tim is typing...' message
  document.getElementById('input').addEventListener('input', function (e) {
    if (document.getElementById('input').value) {
      socket.emit('keypress', { message: true });
    } else if (document.getElementById('input').value === '') {
      socket.emit('keypress', { message: false });
    }
  })

  // The server sends the 'Tim is typing' to the receiver.
  socket.on('keypress', function (nickname) {
    var typing = document.getElementById('typing');
    if (nickname) {
      typing.textContent = nickname + ' is typing';
    } else if (!nickname) {
      typing.textContent = '';
    }
  });
}

// Send the message to the server, along with a bunch of other stuff
function submitMessage(e, socket, room, userObject) {
  e.preventDefault();
  if (document.getElementById('input').value === '') return;
  var message = document.getElementById('input').value;
  socket.emit('chat message', { 
    given_name: 'Brian', 
    message: message 
  });
  document.getElementById('input').value = '';
  socket.emit('keypress', { message: false });
  return false;
}

// This is a legacy function which is not used anymore
function getElementFromText(text, type) {
  var tn = document.createTextNode(text);
  var element = document.createElement(type);
  element.appendChild(tn);
  return element;
}

// This has been replaced with chatHistory()
function addChatToPage(userObject, socket) {
  var roomContainer = document.getElementById('room-container');
  for (var i = 0; i < userObject.hangouts.length; i++) {
    (function () {
      if (!userObject.hangouts[i].second_person) return;

      var hangout = userObject.hangouts[i];

      var chatId = hangout._id;
    }())
  }
}

//Used to deal with the query strings. 
function getFbToken() {
  var url = window.location.href;
  if (url.indexOf('=') === -1) return '111082239432346';
  var qs = url.slice(url.lastIndexOf('=') + 1);
  return qs;
}