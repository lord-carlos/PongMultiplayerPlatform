var socket = io();
var gameData;

socket.on("connect", function(){
  socket.emit("play", {name: "Jesper Web"});
})
socket.on("update", function (data) {
  gameData = data;
});

setInterval(function(){
  if(gameData){
    if(gameData.ball.position.y > gameData.paddles[socket.id].position.y + (gameData.paddles[socket.id].height/2))
    {
      socket.emit("moveDown");
    }
    else
    {
      socket.emit("moveUp");
    }
    gameData = "";
  }
}, 60/1000);
