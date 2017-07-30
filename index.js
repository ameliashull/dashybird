var PLAYER_SIZE = 20;

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var groundLevel = c.height - 50; // y position of ground
var scoreText = document.getElementById("score");

var gameOver;
var score = 0;
var obstacles;
var scrollSpeed;
var player;

newGame();

function newGame() {
  gameOver = true;
  obstacles = [];
  score = 0;
  scoreText.innerHTML = "score: " + score;
  scrollSpeed = 2;
  player = {
    x: c.width / 4,
    y: groundLevel - PLAYER_SIZE,
    y_velocity:0
  };
}

setInterval(frameUpdate, 10);

function frameUpdate() {
  if(gameOver == false) {
    updateGameState();  
  }
  drawGame();
}

function drawGame() {
  drawSky();
  drawPlayer();
  drawObstacles();
  drawGround();
  
  if (gameOver) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("press space to begin",50,50);
  }
}



function drawSky() {
  //sky
  ctx.beginPath();
  ctx.rect(0, 0, c.width, c.height);
  var grad = ctx.createLinearGradient(0,0,0,400);
  grad.addColorStop(0,"white");
  grad.addColorStop(1,"LightPink");
  ctx.fillStyle = grad;;
  ctx.fill();
  
}

function drawGround() {
  ctx.beginPath();
  ctx.rect(0, groundLevel, c.width, 50);
  ctx.fillStyle = "Moccasin";
  ctx.fill();
}


function drawPlayer() {
  ctx.beginPath();
  img = new Image();
  img.src = 'http://diysolarpanelsv.com/images/bird-clipart-png-13.png';
  ctx.drawImage(img, player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);

  //ctx.rect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
  //ctx.fillStyle = "Purple";
  //ctx.fill();
}

function drawObstacles() {
  var k = obstacles.length;
  while(k--) {
    var obst = obstacles[k];
    ctx.beginPath();
    ctx.rect(obst.x, obst.y, PLAYER_SIZE, obst.height);
    ctx.fillStyle = "black";
    ctx.fill();
  }
}


document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
  if(e.keyCode == 32) {
    if(gameOver == true){
      newGame();
      gameOver = false;
    }
    player.y_velocity = -3;
  }
}

var setCoolDown = 60;
var coolDown = setCoolDown;

function updateGameState() {
  scrollSpeed = scrollSpeed + .001; //to move obstacles faster and faster
  //update player position and velocity
  player.y = player.y + player.y_velocity;
  if(player.y >= groundLevel - PLAYER_SIZE) { // hitting the ground
    player.y = groundLevel - PLAYER_SIZE;
    player.y_velocity = 0;
  } else if (player.y < 0) {// bouncing off of top
    player.y_velocity = .1;
    player.y = 0;
  } else { //applying a little gravity
    player.y_velocity += .1;
  }
  

  //Checks cooldown, if cooldown has run out
  //spawns obstacle and resets cool down randomly
  coolDown --;
  if(coolDown < 1) {
    coolDown = setCoolDown + (Math.random() * 50);
    spawnObstacle();
  }
  
  //update obstacle position
  var k = obstacles.length;
  while(k--) {
    var obst = obstacles[k];
    obst.x = obst.x - scrollSpeed;
    
    //tests if player is touching obst
    if (Math.abs(obst.x - player.x) < PLAYER_SIZE && player.y + PLAYER_SIZE > obst.y && player.y < obst.height + obst.y) {
      gameOver = true;
    }
    
    if(obst.x < 0) {
      score++;
      scoreText.innerHTML = "score: " + score;
      obstacles.splice(k, 1);
    }
  }

}

function spawnObstacle() {
  var height = Math.random() * 70 + PLAYER_SIZE
  var obst = {
    x: c.width,
    y: Math.random() * (c.height - (c.height - groundLevel) - (height/2)),
    height: height
  }
  obstacles.push(obst);
}