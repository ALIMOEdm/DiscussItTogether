/**
 * Created by ALIMOE on 11.06.14.
 */

var app = require('express')();
var server = require('http').Server(app);
//var server = require('http').createServer(app);
var io = require('socket.io')(server);
var url = require('url');
var cookie = require('cookie');

var room = [];//[{сокетИд - комната}, {сокетИд - комната}]
var cur_room = "";

var roomToSocketId = {};//сессия_юзер - сокетИд
var users_room = {};//[комната][сессия_юзер_1, сессия_юзер_2, сессия_юзер_2]

var newUser = {};
var newUserStackRefer = {};
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

        var loc_room = room[socket.id];

        var users = users_room[loc_room];

        newUser[loc_room] = users;//всех существующих пользаков в массив, теперь каждому надо отправить сообщение, и попробовать стянуть данные
        console.log(newUser[loc_room]);
        if(newUserStackRefer[loc_room] != undefined){
            if(newUserStackRefer[loc_room] < (newUser[loc_room].length)){
                console.log("findOther1");

                console.log(roomToSocketId[newUser[loc_room][newUserStackRefer[loc_room]]], newUserStackRefer[loc_room]);
//                if(roomToSocketId[newUser[loc_room][newUserStackRefer[loc_room]]] != socket.id)
                    io.sockets.to(roomToSocketId[newUser[loc_room][newUserStackRefer[loc_room]]]).emit('findOther', {find_other : data});

                newUserStackRefer[loc_room]++;

            }
            else{
                newUserStackRefer[loc_room] = 0;
                io.sockets.to(roomToSocketId[newUser[loc_room][newUserStackRefer[loc_room]]]).emit('findOther', {find_other : data});
            }
        }else{
            newUserStackRefer[loc_room] = 0;
            console.log("findOther2");
            //io.sockets.to(roomToSocketId[newUser[loc_room][newUserStackRefer[loc_room]]]).emit('findOther', {find_other : data});
        }
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
    socket.on('removeNote', function(data){
        console.log("removeNote");
        //socket.broadcast.emit('newNote', {newNote : data});
        socket.broadcast.to(room[socket.id]).emit('removeNote', {remNote : data});
    });
    socket.on('editNote', function(data){
        console.log("editNote");
        //socket.broadcast.emit('newNote', {newNote : data});
        socket.broadcast.to(room[socket.id]).emit('editNote', {edNote : data});
    });
    socket.on('room', function(data){
        console.log("room");

        //если пользователь перезагрузил страницу, но у него осталась php сессия, то удаляем его старый socket.id ил вставляем новый
        removeOldSocket(socket);

        socket.join(data.room);
        room[socket.id] = data.room;

        if(users_room[data.room] == undefined){
            users_room[data.room] = [];
            users_room[data.room].push(socket.request.sessionID);
        }else{
            for(var i = 0; i < users_room[data.room].length; i++){
                if(users_room[data.room][i] == socket.request.sessionID){
                    users_room[data.room].splice(i,1);
                }
            }
            users_room[data.room].push(socket.request.sessionID);
        }
    });
});

io.set('authorization', function(data, accept){
    console.log("authorization");
    if(!data.headers.cookie)
        return accept('no cookie', false);
    //парсим куки
    data.cookie = cookie.parse(data.headers.cookie);

    //получаем ид сессии
    var sid = data.cookie['PHPSESSID'];

    if(!sid)
        accept(null, false);

    data.sessionID = sid;

    accept(null, true);
});

function removeOldSocket(socket){
    var old_sock_id = "";
    if(roomToSocketId[socket.request.sessionID] != undefined){
        old_sock_id = roomToSocketId[socket.request.sessionID];
    }
    roomToSocketId[socket.request.sessionID] = socket.id;
    if(old_sock_id){
        socket.leave(room[old_sock_id]);
        delete room[old_sock_id];
    }
}