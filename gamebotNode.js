var socket = require('socket.io-client')('http://localhost:2000');
var gameData;

socket.on("connect", function(){
  socket.emit("play", {name: "Jesper-NodeJS"});
})
socket.on("update", function (data) {
  gameData = data;
});

setInterval(function(){
  if(gameData){
    if(gameData.ball.position.y+25 > gameData.paddles[socket.id].position.y + (gameData.paddles[socket.id].height/2))
    {
      socket.emit("moveDown"); //keeps moving down until "moveUp" or "stop" is called
    }
    else
    {
      socket.emit("moveUp");
    }
    gameData = "";
  }
}, 60/1000);
