// Setting up canvas and getting its context
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

var x = width / 2;		// ball X starting location (center)
var y = height / 2;		// ball Y starting location (center)
var dx = 6;				//ball X speed
var dy = 3;				//ball Y speed	

var racketSpeed = 4;	// racket speed

var racketWidth = 20;	// racket width
var racketHeight = 80;	// racket height
var racketY = (height - racketHeight) / 2; // both players' rackets' upper left corner for fillRect() at start

// Setting up scoreboard 0 | 0, score cutoff at 10
var scorePlayerOne = 0;
var scorePlayerTwo = 0;
var maxScore = 10;

// Conditions needed for serving and win/lose state (var serving should be "true" to enable serving ability)
var playing = true;
var serving = false;

// Controls for P1/P2 and serve/reset
var controls = {
	13: "enter",
	32: "space",
	87: "w",
	83: "s",
	38: "arrowUp",
	40: "arrowDown"
};

// Ball radius
var radius = 10;

// Function to draw playing field's lines
var lines = function () {
	ctx.strokeStyle = "White";
	ctx.beginPath();
	ctx.lineWidth = 6;
	ctx.strokeRect(3, 3, width - 6, height - 6);
	ctx.closePath();
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(0, height / 2);
	ctx.lineTo(width / 2 - 30, height / 2);
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.moveTo(width / 2 + 30, height / 2);
	ctx.lineTo(width, height / 2);
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.moveTo(width / 2, 0);
	ctx.lineTo(width / 2, height);
	ctx.stroke();
	ctx.closePath();
}

// Function for announcing when player scores
var score = function (playerId) {
	ctx.font = "50px Bangers";
	ctx.fillStyle = "OldLace";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	ctx.fillText("Player " + playerId + " SCORES!", width / 2, 0);
};

// Function for drawing score
var drawScore = function () {
	ctx.font = "40px Bangers";
	ctx.fillStyle = "OldLace";
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	ctx.fillText(scorePlayerOne + " | " + scorePlayerTwo, width / 2, height);
};

// Function to allow reseting the game whenever players want
var reset = function () {
	playing = true;
	serving = false;
	scorePlayerOne = 0;
	scorePlayerTwo = 0;
	ball.x = width / 2;
	ball.y = height / 2;
	ball.dx = 6;
	ball.dy = 3;
	clearInterval(intervalId);
	intervalId = setInterval(gameLoop, 17);
};

// Function for checking if the match has finished or not
var gameOver = function (playerId) {
	playing = false;
	ctx.font = "50px Bangers";
	ctx.fillStyle = "OldLace";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	ctx.fillText("PLAYER " + playerId + " WON!", width / 2, 0);
};

// Function for drawing ball: inner circle and outline
var circle = function (x, y, radius, fillCircle) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, false);
	if (fillCircle) {
		ctx.fillStyle = "Darkorange";
		ctx.fill();
	} else {
		ctx.lineWidth = 1;
		ctx.strokeStyle = "Black";
		ctx.stroke();
	}
	ctx.closePath();
};

// Ball constructor with center location and speed
var Ball = function () {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
};

// Ball method for drawing
Ball.prototype.draw = function () {
	circle(this.x, this.y, radius, true);
	circle(this.x, this.y, radius, false);
};

// Ball method for updating its center location for the next frame, i.e. moving
Ball.prototype.move = function () {
	this.x += this.dx;
	this.y += this.dy;
};

// Ball method for detecting collisions and bouncing off of top and bottom edges, and rackets
Ball.prototype.collision = function () {
	if (this.y + dy - radius < 0 || this.y + dy + radius > height) {
		this.dy = -this.dy;
	}
	if (this.y > racketOne.y && this.y < racketOne.y + racketHeight && this.x < racketOne.x + racketWidth) {
		this.dx = -this.dx;
	}
	if (this.y > racketTwo.y && this.y < racketTwo.y + racketHeight && this.x > racketTwo.x) {
		this.dx = -this.dx;
	}
};

// Ball method for updating the score AND announcing who scored for player one and player two
Ball.prototype.point = function () {
	if (this.x < 0) {
		scorePlayerTwo++;
		if (scorePlayerTwo === maxScore) {
			gameOver(2);
		} else {
			score(2);
		}
		clearInterval(intervalId);
		serving = true;
	} else if (this.x > width) {
		scorePlayerOne++;
		if (scorePlayerOne === maxScore) {
			gameOver(1);
		} else {
			score(1);
		}
		clearInterval(intervalId);
		serving = true;
	}
};

// Rackets' constructor with top left corner coordinates and color
var Racket = function (x, color) {
	this.x = x;
	this.y = racketY;
	this.color = color;
};

// Rackets' method for drawing them
Racket.prototype.draw = function () {
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x, this.y, racketWidth, racketHeight);
	ctx.closePath();
};

// Racket's method for updating their top left corner position and checking if they are within the boundaries of the field
Racket.prototype.move = function () {
	if (twoMoveUp) {
		if (racketTwo.y === 0) {
			racketTwo.y = 0;
		} else {
		racketTwo.y -= racketSpeed;
		}
	}
	if (twoMoveDown) {
		if (racketTwo.y + racketHeight === height) {
			racketTwo.y = height - racketHeight;
		} else {
		racketTwo.y += racketSpeed;
		}
	}
	if (oneMoveUp) {
		if (racketOne.y === 0) {
			racketOne.y = 0;
		} else {
		racketOne.y -= racketSpeed;
		}
	}
	if (oneMoveDown) {
		if (racketOne.y + racketHeight === height) {
			racketOne.y = height - racketHeight;
		} else {
		racketOne.y += racketSpeed;
		}
	}
};

// Creating ball and rackets objects
var ball = new Ball();
var racketOne = new Racket(0, "Blue");
var racketTwo = new Racket(width - racketWidth, "Red");

// Allowing two inputs at once for moving both rackets (sticky controls) by setting up move condtions
var oneMoveUp = false;
var oneMoveDown = false;
var twoMoveUp = false;
var twoMoveDown = false;

// Event handler for serving the ball and reseting the match
$("body").keydown(function (event) {
	var pressedControls = controls[event.keyCode];
	if (pressedControls !== undefined && pressedControls === "space" && serving && playing) {
		serving = false;
		ball.x = width / 2;
		ball.y = height / 2;
		ball.dx = -ball.dx;
		ball.dy = -ball.dy;
		intervalId = setInterval(gameLoop, 17);
	}
	if (pressedControls !== undefined && pressedControls === "enter") {
		reset();
	}
});

// Event handler for listening keydown events for player one
$("body").keydown(function (event) {
	var pressedControlsOne = controls[event.keyCode];
	if (pressedControlsOne !== undefined && !oneMoveUp && pressedControlsOne === "w") {
		oneMoveUp = true;
	}
	if (pressedControlsOne !== undefined && !oneMoveUp && pressedControlsOne === "s") {
		oneMoveDown = true;
	}
});

// Event handler for listening keyup events for player one
$("body").keyup(function (event) {
	var depressedControlsOne = controls[event.keyCode];
	if (depressedControlsOne !== undefined && oneMoveUp && depressedControlsOne === "w") {
		oneMoveUp = false;
	}
	if (depressedControlsOne !== undefined && oneMoveDown && depressedControlsOne === "s") {
		oneMoveDown = false;
	}
});

// Event handler for listening keydown events for player two
$("body").keydown(function (event) {
	var pressedControlsTwo = controls[event.keyCode];
	if (pressedControlsTwo !== undefined && !twoMoveUp && pressedControlsTwo === "arrowUp") {
		twoMoveUp = true;
	}
	if (pressedControlsTwo !== undefined && !twoMoveUp && pressedControlsTwo === "arrowDown") {
		twoMoveDown = true;
	}
});

// Event handler for listening keyup events for player two
$("body").keyup(function (event) {
	var depressedControlsTwo = controls[event.keyCode];
	if (depressedControlsTwo !== undefined && twoMoveUp && depressedControlsTwo === "arrowUp") {
		twoMoveUp = false;
	}
	if (depressedControlsTwo !== undefined && twoMoveDown && depressedControlsTwo === "arrowDown") {
		twoMoveDown = false;
	}
});

// Function with all game events
function gameLoop () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	lines();
	racketOne.draw();
	racketTwo.draw();
	racketOne.move();
	racketTwo.move();
	ball.draw();
	ball.move();
	ball.collision();
	ball.point();
	drawScore();
}

// Looping game event's function
var intervalId = setInterval(gameLoop, 17);