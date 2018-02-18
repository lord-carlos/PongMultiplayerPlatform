var socket = require('socket.io-client')('http://localhost:2000');
var gameData;
var oldPoint = {x: 0, y: 0};

socket.on("connect", function(){
  socket.emit("play", {name: "Carl-NodeJS"});
})
socket.on("update", function (data) {
  gameData = data;
});

setInterval(function(){
  if(gameData){
    var estimate  = estimateCalc();
    var hest = gameData.ball.position.y;

    var paddle = gameData.paddles[socket.id];
        
    
    if(estimate > (paddle.position.y + (paddle.height/6)) && paddle.position.y + paddle.height <= 700)
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

function estimateCalc() {
    var currentPoint = {x: gameData.ball.position.x, y: gameData.ball.position.y}
    
    var diff = {
        x: currentPoint.x - oldPoint.x,
        y: currentPoint.y - oldPoint.y
    }
               
    var targetx = gameData.paddles[socket.id].position.x;
    
    var oldDiff = targetx - oldPoint.x;
    console.log("oldPoint.x: " + oldPoint.x);
    var newDiff = targetx - currentPoint.x;
    if(diff.x < 0) {
        console.log("newDiff: " + newDiff);
        console.log("oldDiff: " + oldDiff);
        oldPoint = currentPoint;
        return 350;
    }
    
    var xchange = targetx - currentPoint.x;
    var xticks = xchange / diff.x;
    
    var ychange = xticks * diff.y;
    
    
    oldPoint = currentPoint;
    return currentPoint.y + ychange;
}

function distance2ball() {
}
