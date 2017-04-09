var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var morgan = require('morgan');

var path = require('path');

// This asks for the POST information to be application/x-www-urlencoded
// Instead of using data: {key: value} format.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;

//Register Our Routes Here
app.use('/', express.static('public'));

const server = app.listen(port);
console.log('Magic happens on port ' + port);

var socketio = require('socket.io');
var io = require('./app/routing/socketio_client.js');

io(socketio.listen(server));
