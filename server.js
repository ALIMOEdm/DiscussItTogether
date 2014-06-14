/**
 * Created by ALIMOE on 11.06.14.
 */

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(9091);

io.on('connection', function(socket){
    console.log('connection');
    socket.emit('hello', {hello : 'world'});
    socket.on('image', function(data){
        console.log("hi");
        socket.broadcast.emit('image', {data : data});
    });
    socket.on('drawRect', function(data){
        console.log("drawRect");
        socket.broadcast.emit('drawRect', {rectCoords : data});
    });
    socket.on('drowPometki', function(data){
        console.log("drowPometki");
        socket.broadcast.emit('drowPometki', {line : data});
    });
});