var socket = require('socket.io-client')('http://localhost:2000');
var gameData;
var oldPoint = {x: 0, y: 0};

socket.on("connect", function(){
  socket.emit("play", {name: "Carl-6"});
})
socket.on("update", function (data) {
  gameData = data;
});

setInterval(function(){
  if(gameData){
    var estimate  = estimateCalc();
    //var hest = gameData.ball.position.y;

    var paddle = gameData.paddles[socket.id];
    var foo;
    if(estimate < 350) {
        foo = paddle.position.y + (paddle.height/6);
    } else {
        foo = paddle.position.y + 5 * (paddle.height/6)
    }
    
    if(estimate >= foo && paddle.position.y + paddle.height <= 700)
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
//     console.log(gameData.paddles);
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
    if(isLeftSide) {
        targetx += gameData.paddles[socket.id].width;
    }
    
    var oldDiff = Math.abs(targetx - oldPoint.x);
    var newDiff = Math.abs(targetx - currentPoint.x);
    if(oldDiff < newDiff) { 
        oldPoint = currentPoint;
        return 350;
    } else if(newDiff < 50) {
        oldPoint = currentPoint;
        return currentPoint.y;
    }
    
    var xchange = targetx - currentPoint.x;
    var xticks = xchange / diff.x;
    
    var ychange = xticks * diff.y;
    var yestimate = currentPoint.y + ychange
    
    if(yestimate < 0) {
        yestimate = Math.abs(yestimate);
    } else if (yestimate > 700) {
        yestimate = 700 - (700 - yestimate);
    }
    
    oldPoint = currentPoint;
    return yestimate;
}

function isLeftSide() {
    var targetx = gameData.paddles[socket.id].position.x;
    if(targetx > 30) 
    {
        return false;
    }
    return true;
}
