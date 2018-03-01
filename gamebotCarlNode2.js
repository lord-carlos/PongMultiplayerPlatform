var socket = require('socket.io-client')('http://localhost:2000');
var gameData;
var oldPoint = {x: 0, y: 0};

socket.on("connect", function(){
  socket.emit("play", {name: "Carl-fancy"});
})
socket.on("update", function (data) {
  gameData = data;
});

setInterval(function(){
  if(gameData){
    var estimate  = estimateCalc();
    //var hest = gameData.ball.position.y;
    var enemy;
    for (var id in gameData.paddles) {
        if(id != socket.id) {
            enemy = gameData.paddles[id];
        }
    }

    var paddle = gameData.paddles[socket.id];
    var foo;
    if(enemy.position + (enemy.height/2) > 350) {
        foo = paddle.position.y + (paddle.height/8);
    } else {
        foo = paddle.position.y + 7 * (paddle.height/8)
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
    
    
    yestimate = calcBounce(yestimate);
    
    oldPoint = currentPoint;
    return yestimate;
}

function calcBounce(yestimate) {
    var ballRad = gameData.ball.diameter / 2
    var lowerBorder = 700 - ballRad;
//     if(yestimate > 4000) {
//         return 4000;
//     }
    if(yestimate < 0 + ballRad) {
        yestimate = Math.abs(yestimate);
//         yestimate = calcBounce(yestimate);
    } else if (yestimate > lowerBorder) {
        yestimate = lowerBorder - (yestimate - lowerBorder);
//         yestimate = calcBounce(yestimate);
    }
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
