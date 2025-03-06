// GAME CONFIGURATION
const BOOST_CONFIG = {
  MAX_BOOST: 100,
  BOOST_REGEN_RATE: 0.3,  // Amount of boost regenerated per frame 0.2
  BOOST_USE_RATE: 1,      // Amount of boost used per frame
  BOOST_FORCE: 6.5,       // Boost strength
  MAX_SPEED: 100,           // Maximum speed
  BASE_SPEED: 4,        // Base forward speed
  BRAKE_SPEED: 0.6,       // Speed multiplier when braking (30% of base speed)
  MIN_BOOST_TO_USE: 10,    // Minimum boost required to activate
  BALL_FRICTION: 0.2,     // Ball friction coefficient
  CAR_FRICTION: 0.05      // Car friction coefficient
};

// SET CANVAS SIZE AND APPEND TO BODY
var CANVAS_WIDTH = 1200;
var CANVAS_HEIGHT = 555;

var canvasElement = $("<canvas width='" + CANVAS_WIDTH +
                      "' height='" + CANVAS_HEIGHT + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('body');
var players = [];
var scoreOrange = 0;
var scoreBlue = 0;
var timerCount = 120; // 2 Minute Time Limit
var timerID;

// DRAW
function draw() {
  canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.fillStyle = "rgba(255, 120, 0, .7)";
  canvas.fillRect(0,0,CANVAS_WIDTH/2,CANVAS_HEIGHT);
  canvas.fillStyle = "rgba(0, 0, 255, .5)";
  canvas.fillRect(CANVAS_WIDTH/2,0,CANVAS_WIDTH/2,CANVAS_HEIGHT);
  ball.draw();
  for (var i=0; i<players.length; i++) {
    players[i].draw();
  }
}

// UPDATE
function update() {
  for(var i=0; i < players.length; i++) {
    // Apply constant forward movement
    players[i].vel = BOOST_CONFIG.BASE_SPEED;

    // Update boost
    if (players[i].isBoosting && players[i].boost > BOOST_CONFIG.MIN_BOOST_TO_USE) {
      players[i].boost = Math.max(0, players[i].boost - BOOST_CONFIG.BOOST_USE_RATE);
      
      // Apply boost force in the direction the car is facing
      var boostX = BOOST_CONFIG.BOOST_FORCE * Math.sin(players[i].rot*Math.PI/180);
      var boostY = -BOOST_CONFIG.BOOST_FORCE * Math.cos(players[i].rot*Math.PI/180);
      
      // Update velocity components
      players[i].velX = boostX;
      players[i].velY = boostY;
      
      // Calculate total velocity
      var totalVel = Math.hypot(players[i].velX, players[i].velY);
      
      // Clamp velocity to maximum speed
      if (totalVel > BOOST_CONFIG.MAX_SPEED) {
        var scale = BOOST_CONFIG.MAX_SPEED / totalVel;
        players[i].velX *= scale;
        players[i].velY *= scale;
      }
    } else {
      players[i].boost = Math.min(BOOST_CONFIG.MAX_BOOST, players[i].boost + BOOST_CONFIG.BOOST_REGEN_RATE);
      players[i].velX = BOOST_CONFIG.BASE_SPEED * Math.sin(players[i].rot*Math.PI/180);
      players[i].velY = -BOOST_CONFIG.BASE_SPEED * Math.cos(players[i].rot*Math.PI/180);
    }

    // Apply braking
    if (players[i].isBraking) {
      players[i].velX *= BOOST_CONFIG.BRAKE_SPEED;
      players[i].velY *= BOOST_CONFIG.BRAKE_SPEED;
    }

    // Update boost meters
    document.getElementById('orange-boost-fill').style.width = (players[0].boost) + '%';
    document.getElementById('blue-boost-fill').style.width = (players[1].boost) + '%';

    // Update position
    players[i].xMid += players[i].velX;
    players[i].yMid += players[i].velY;
  }

  ball.x += ball.velX;
  ball.y += ball.velY;

  //// DEFINES GOALS AND EDGE OF ARENA
  // input -> goal width
  ballWallCollisionDetect(180);
  carWallCollisionDetect();
  //// CAR TO BALL COLLISION REACTION (DETECTION(PLAYERS ARRAY))
  carFrontBallCollision(frontFaceToBallCalc(players));
  carRightBallCollision(rightFaceToBallCalc(players));
  carLeftBallCollision(leftFaceToBallCalc(players));
  carBottomBallCollision(bottomFaceToBallCalc(players));
  //// Updates position of all corners of both vehicles
  northEastCornerHit();
  northWestCornerHit();
  southEastCornerHit();
  southWestCornerHit();
}

/* PLAYER CONSTRUCTOR */

function Player(color, xInitial, yInitial, rotInitial, colorPath) {
  this.color = color;
  this.x = xInitial;
  this.y = yInitial;
  this.rot = rotInitial;
  this.vel = 0;
  this.velX = 0;
  this.velY = 0;
  this.width = 45;
  this.height = 75;
  this.xMid = this.x + this.width/2;
  this.yMid = this.y + this.height/2;
  this.boost = BOOST_CONFIG.MAX_BOOST;
  this.isBoosting = false;
  this.isBraking = false;
  this.draw = function() {
    var drawing = new Image();
    drawing.src = colorPath;

    canvas.save();
    canvas.translate(this.xMid, this.yMid);
    canvas.rotate(this.rot*Math.PI/180);
    canvas.drawImage(drawing, -this.width/2, -this.height/2,this.width,this.height);
    canvas.restore();
  }
}

/* DEFINE BALL OBJECT */

// caching ball image outside of draw function so it only loads once
var ballDrawing = new Image();
ballDrawing.onload = function () {
  ball.draw();
}
ballDrawing.src = "assets/RLball.png";

var ball = {
  x: CANVAS_WIDTH/2,
  y: CANVAS_HEIGHT/2,
  radius: 30,
  velX: 0,
  velY: 0,
  draw: function() {
    canvas.drawImage(ballDrawing, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
  }
}

/* CREATE/RESET PLAYERS AND BALL */

function resetGame() {
  canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  players = [];
  player1 = new Player("dodgerblue", CANVAS_WIDTH/9-45/2, CANVAS_HEIGHT/2-75/2, 90, "assets/Car_orange.png");
  player2 = new Player("orange", CANVAS_WIDTH/9*8-45/2, CANVAS_HEIGHT/2-75/2, -90, "assets/Car_blue.png");
  players.push(player1, player2);
  
  // Reset boost meters
  players[0].boost = BOOST_CONFIG.MAX_BOOST;
  players[1].boost = BOOST_CONFIG.MAX_BOOST;
  document.getElementById('orange-boost-fill').style.width = '100%';
  document.getElementById('blue-boost-fill').style.width = '100%';

  ball.x = CANVAS_WIDTH/2;
  ball.y = CANVAS_HEIGHT/2;
  ball.velX = 0;
  ball.velY = 0;
  ball.draw();
}

/* STARTS GAME ON PRESS OF START BUTTON */

function startGame() {
  resetGame();
  setTimer();
  $('.start-button').css("display", "none");
  $('.logo-timer').replaceWith('<div class="count-down">2:00</div>');
  $('.center').css("height", "110px");
}


function KeyboardController(keys, repeat) {
    var timers= {};

    // When key is pressed and we don't already think it's pressed, call the
    // key action callback and set a timer to generate another one after a delay
    //
    document.onkeydown= function(event) {
        var key= (event || window.event).keyCode;
        if (!(key in keys))
            return true;
        if (!(key in timers)) {
            timers[key]= null;
            keys[key]();
            if (repeat!==0)
                timers[key]= setInterval(keys[key], repeat);
        }
        return false;
    };

    // Cancel timeout and mark key as released on keyup
    //
    document.onkeyup= function(event) {
        var key= (event || window.event).keyCode;
        if (key in timers) {
            if (timers[key]!==null)
                clearInterval(timers[key]);
            delete timers[key];
        }
    };

    // When window is unfocused we may not get key events. To prevent this
    // causing a key to 'get stuck down', cancel all held keys
    //
    window.onblur= function() {
        for (key in timers)
            if (timers[key]!==null)
                clearInterval(timers[key]);
        timers= {};
    };
};

KeyboardController({
  // PLAYER 1 CONTROLS
  // A
    65: function() { players[0].rot -= 10; },
  // W (Boost)
    87: function() { players[0].isBoosting = true; },
  // D
    68: function() { players[0].rot += 10; },
  // S (Brake)
    83: function() { players[0].isBraking = true; },
  // PLAYER 2 CONTROLS
  // left
    37: function() { players[1].rot -= 10; },
  // up (Boost)
    38: function() { players[1].isBoosting = true; },
  // right
    39: function() { players[1].rot += 10; },
  // down (Brake)
    40: function() { players[1].isBraking = true; },
}, 50);

// Add key up event listeners
document.addEventListener('keyup', function(event) {
  if (event.keyCode === 87) { // W key
    players[0].isBoosting = false;
  }
  if (event.keyCode === 38) { // up arrow
    players[1].isBoosting = false;
  }
  if (event.keyCode === 83) { // S key
    players[0].isBraking = false;
  }
  if (event.keyCode === 40) { // down arrow
    players[1].isBraking = false;
  }
});

/* BALL SPEED DECAY */
function ballFriction(friction) {
  if (Math.hypot(ball.velX, ball.velY) > 0) {
    ball.velX -= ball.velX*friction;
    ball.velY -= ball.velY*friction;
  }
}

function carFriction(friction) {
  for (var i=0; i < players.length; i++) {
    players[i].vel -= players[i].vel*friction;
  }
}

// SPEED DECAY FUNCTION CALL
setInterval(function() {
  ballFriction(BOOST_CONFIG.BALL_FRICTION);
  carFriction(BOOST_CONFIG.CAR_FRICTION);
}, 500);

// TIMER ACTION
function setTimer() {
  timerID = setInterval(function() {
    var timeRemaining = timerLogic(timerCount-1);
    $('.count-down').text(timeRemaining[0] + ":" + timeRemaining[1]);
    if (timerCount > -1) {
    timerCount--;
    }
    if (timerCount === 30) {
      $('.two-minute-warning').trigger("play");
    }
    if (timerCount <= 10 && timerCount > 0) {
       //pause playing
    $('.timer-running-out').trigger('pause');
    //set play time to 0
    $('.timer-running-out').prop("currentTime",0);
      $('.timer-running-out').trigger("play");
    }
    if (timerCount === 0) {
      $('.game-over').trigger("play");
    }
    if (timerCount === -1) {
      $('.count-down').text("0:00");
      gameOver();
      clearInterval(timerID);
    }
  }, 1000);
}

function timerLogic(timerCount) {
  var minutes = Math.floor(timerCount/60);
  var seconds = timerCount - minutes*60;
  seconds = (seconds % 60 > 9) ? seconds % 60 : "0" + seconds % 60;
  return [minutes, seconds];
}

function gameOver() {
  clearInterval(timerID);
  $('.game-over').toggleClass('hidden');
  winnerAnnounce = $('.winner-announce');
  if (scoreBlue > scoreOrange) {
    winnerAnnounce.text("WINNER! BLUE");
    winnerAnnounce.css("color", "blue");

  } else if (scoreOrange > scoreBlue) {
    winnerAnnounce.text("WINNER! ORANGE");
    winnerAnnounce.css("color", "orange");
  } else {
    winnerAnnounce.text("TIE GAME!");
    winnerAnnounce.css("color", "white");
  }
}

function playAgain() {
  resetGame();

  // STOP time
  clearInterval(timerID);
  timerCount = 120;
  $('.count-down').text("2:00");
  setTimer();

  // RESET Score
  scoreOrange = 0;
  scoreBlue = 0;
  $('.orange').text(scoreOrange);
  $('.blue').text(scoreBlue);
}

// FPS SETTING
var FPS = 60;
setInterval(function() {
  update();
  requestAnimationFrame(draw);
}, 1000/FPS);

/* DOM INITIALIZATION */

$('.orange').text(scoreOrange);
$('.blue').text(scoreBlue);

/* EVENT LISTENERS */
var playButton = $('.play-again');

// Instructions Pane
$instructions = $('.instructions');

// START BUTTON
$startButton = $('.start-button');
$startButton.on("click", function() {
  startGame();
  $instructions.toggleClass('hidden');
});
$startButton.hover(function(event) {
  $startButton.css("background", "darkgreen");
}, function(event) {
  $startButton.css("background", "green");
});


// play-again button CLICK
playButton.on("click", function() {
  playAgain();
  $('.game-over').toggleClass('hidden');
});

// PLAY AGAIN? BUTTON
playButton.hover(function(event) {
  playButton.css("background-color", "black");
  playButton.css("color", "yellow");
}, function(event) {
  playButton.css("background-color", "yellow");
  playButton.css("color", "black");
});

function closeGame() {
  // Remove game elements
  const gameContainer = document.querySelector('.game-container');
  if (gameContainer) {
    gameContainer.remove();
  }
  
  // Reset any game state
  if (typeof resetGameState === 'function') {
    resetGameState();
  }
  
  // Show other page elements
  document.body.classList.remove('game-active');
}


