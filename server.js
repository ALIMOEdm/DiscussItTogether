/**
 * Created by ALIMOE on 11.06.14.
 */

//var app = require('express')();
//var server = require('http').Server(app);
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var url = require('url');

var room = [];
var cur_room = "";

function app(req,res){
    //console.dir(url.parse(req.url).query);

//    var params = url.parse(req.url).query;
//    var param_arr = params.split("&");
//    if(param_arr.length){
//        for(var i = 0; i < param_arr.length; i++){
//            var par = param_arr[i].splice("=");
//            if(par[0] == "room"){
//                cur_room = par[1];
//            }
//        }
//    }

    res.writeHead(200);
    res.write("test");
    res.end();
}
server.listen(9091);
io.on('connection', function(socket){
    console.log('connection');
    socket.emit('hello', {hello : 'world'});
    socket.on('image', function(data){
        console.log("hi");
        //socket.broadcast.emit('image', {data : data});
        socket.broadcast.to(room[socket.id]).emit('image', {data : data});
    });
    socket.on('drawRect', function(data){
        console.log("drawRect");
        //socket.broadcast.emit('drawRect', {rectCoords : data});
        socket.broadcast.to(room[socket.id]).emit('drawRect', {rectCoords : data});
    });
    socket.on('drowPometki', function(data){
        console.log("drowPometki");
        //socket.broadcast.emit('drowPometki', {line : data});
        socket.broadcast.to(room[socket.id]).emit('drowPometki', {line : data});
    });
    socket.on('findOther', function(data){
        console.log("findOther");
        //socket.broadcast.emit('findOther', {find_other : data});
        socket.broadcast.to(room[socket.id]).emit('findOther', {find_other : data});
    });
    socket.on('remoutFirstSett', function(data){
        console.log("remoutFirstSett");
        //socket.broadcast.emit('remoutFirstSett', {remoutFirstSett : data});
        socket.broadcast.to(room[socket.id]).emit('remoutFirstSett', {remoutFirstSett : data});
    });
    socket.on('redrawImage', function(data){
        console.log("redrawImage");
        //socket.broadcast.emit('redrawImage', {redrawImage : data});
        socket.broadcast.to(room[socket.id]).emit('redrawImage', {redrawImage : data});
    });
    socket.on('newNote', function(data){
        console.log("newNote");
        //socket.broadcast.emit('newNote', {newNote : data});
        socket.broadcast.to(room[socket.id]).emit('newNote', {newNote : data});
    });
    socket.on('room', function(data){
        console.log("room");
        socket.leave(room[socket.id]);
        socket.join(data.room);
        room[socket.id] = data.room;
    });

});