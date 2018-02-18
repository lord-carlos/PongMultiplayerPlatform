var socket = require('socket.io-client')('http://localhost:2000');
var gameData;

socket.on("connect", function(){
  socket.emit("play", {name: "Carl-NodeJS"});
})
socket.on("update", function (data) {
  gameData = data;
});

setInterval(function(){
  if(gameData){
    var paddle = gameData.paddles[socket.id];
    if(gameData.ball.position.y > (paddle.position.y + (paddle.height/6)) && paddle.position.y + paddle.height <= 700)
    {
      socket.emit("moveDown");
    }
    else if (paddle.position.y <= 0)
    {
        socket.emit("stop");
    }  
    else
    {
      socket.emit("moveUp");
    }
    gameData = "";
  }
}, 60/1000);
