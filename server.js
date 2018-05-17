var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.get('/', function(req, res){
    res.render('index');
});

var server = app.listen(8000, function(){
    console.log("PORT IS ON BABY!");
});

var io = require('socket.io').listen(server);

var messages = ["<p>CHATROOM STARTED BABY!</p>"];


io.sockets.on('connection', function(socket){
    console.log('SOCKET IS CONNECTED BABY!');
    var user;
    socket.on('got_new_user', function(data){
        console.log(data);
        user = data;
        user.id = socket.id;
        socket.emit("added_user", {messages: messages});
        var joined = "<p>" + "<strong>"+ user.name+ "</strong>" + " " + "has joined";
        messages.push(joined);
        socket.broadcast.emit("update_chat", {message: joined});
    });
    socket.on('new_message', function(data){
        console.log(data);
        messages.push(data.message);
        io.emit('update_chat', {message: data.message});
    });
    socket.on('disconnect', function(){
        console.log(user.name + " disconnected from socket" + socket.id);
    });
});
