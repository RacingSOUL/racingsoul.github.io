var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = canvas.width;
var height = canvas.height;

var x = width / 2; // ball X center
var y = height / 2; // ball Y center
var dx = 6;		//ball X speed
var dy = 3;		//baal Y speed	

var racketSpeed = 4; // racket speed

var racketWidth = 20;
var racketHeight = 80;
var racketY = (height - racketHeight) / 2; // both players start height;

var scorePlayerOne = 0;
var scorePlayerTwo = 0;
var maxScore = 10;

var playing = true;
var serving = true;

var controls = {
	13: "enter",
	32: "space",
	87: "w",
	83: "s",
	38: "arrowUp",
	40: "arrowDown"
};

var radius = 10;

var drawScore = function () {
	ctx.font = "160px Courier";
	ctx.fillStyle = "OldLace";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(scorePlayerOne + " | " + scorePlayerTwo, width / 2, height / 2);
}

function circle (x, y, radius, fillCircle) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, false);
	if (fillCircle) {
		ctx.fill();
	} else {
		ctx.stroke();
	}
	ctx.closePath();
}

var Ball = function () {
	this.x = width / 2;
	this.y = height / 2;
	this.dx = dx;
	this.dy = dy;
};

Ball.prototype.draw = function () {
	ctx.fillStyle = "Black";
	circle(this.x, this.y, 10, true);
}

Ball.prototype.move = function () {
	this.x += this.dx;
	this.y += this.dy;
}

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
}

Ball.prototype.point = function () {
		if (this.x < 0) {
			scorePlayerTwo++;
			if (scorePlayerTwo === maxScore) {
				gameOver(2);
			} else {
				ctx.font = "60px Courier";
				ctx.fillStyle = "Black";
				ctx.textAlign = "center";
				ctx.textBaseline = "top";
				ctx.fillText("Player 2 SCORES!", width / 2, 0);
			}
			clearInterval(intervalId);
			serving = false;
		} else if (this.x > width) {
			scorePlayerOne++;
			if (scorePlayerOne === maxScore) {
				gameOver(1);
			} else {
				ctx.font = "60px Courier";
				ctx.fillStyle = "Black";
				ctx.textAlign = "center";
				ctx.textBaseline = "top";
				ctx.fillText("Player 1 SCORES!", width / 2, 0);
			}
			clearInterval(intervalId);
			serving = false;
		}
	}

var gameOver = function (player) {
	playing = false;
	ctx.font = "60px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	if (player === 1) {
			ctx.fillText("PLAYER 1 WON!", width / 2, 0);
	} else {
			ctx.fillText("PLAYER 2 WON!", width / 2, 0);
	}
}

var reset = function () {
	playing = true;
	serving = true;
	scorePlayerOne = 0;
	scorePlayerTwo = 0;
	ball.x = width / 2;
	ball.y = height / 2;
	ball.dx = 6;
	ball.dy = 3;
	clearInterval(intervalId);
	intervalId = setInterval(gameLoop, 17);
}


var Racket = function (x, color) {
	this.x = x;
	this.y = racketY;
	this.color = color;
}

Racket.prototype.draw = function () {
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x, this.y, racketWidth, racketHeight);
	ctx.closePath();
}

var ball = new Ball();
var racketOne = new Racket(0, "Blue");
var racketTwo = new Racket(width - racketWidth, "Red");

var oneMoveUp = false;
var oneMoveDown = false;


$("body").keydown(function (event) {
	var pressedControls = controls[event.keyCode];
	if (pressedControls !== undefined && pressedControls === "space") {
		if (!serving && playing) {
			serving = true;
			ball.x = width / 2;
			ball.y = height / 2;
			ball.dx = -ball.dx;
			ball.dy = -ball.dy;
			intervalId = setInterval(gameLoop, 17);
		}
	}
	if (pressedControls !== undefined && pressedControls === "enter") {
		reset();
	}
});

$("body").keydown(function (event) {
	var unpressedControlsOne = controls[event.keyCode];
	if (unpressedControlsOne !== undefined && !oneMoveUp && unpressedControlsOne === "w") {
		oneMoveUp = true;
	}
	if (unpressedControlsOne !== undefined && !oneMoveUp && unpressedControlsOne === "s") {
		oneMoveDown = true;
	}
});

$("body").keyup(function (event) {
	var moveOne = controls[event.keyCode];
	if (moveOne !== undefined && oneMoveUp && moveOne === "w") {
		oneMoveUp = false;
	}
	if (moveOne !== undefined && oneMoveDown && moveOne === "s") {
		oneMoveDown = false;
	}
});

var twoMoveUp = false;
var twoMoveDown = false;

$("body").keydown(function (event) {
	var unpressedControlsTwo = controls[event.keyCode];
	if (unpressedControlsTwo !== undefined && !twoMoveUp && unpressedControlsTwo === "arrowUp") {
		twoMoveUp = true;
	}
	if (unpressedControlsTwo !== undefined && !twoMoveUp && unpressedControlsTwo === "arrowDown") {
		twoMoveDown = true;
	}
});

$("body").keyup(function (event) {
	var moveTwo = controls[event.keyCode];
	if (moveTwo !== undefined && twoMoveUp && moveTwo === "arrowUp") {
		twoMoveUp = false;
	}
	if (moveTwo !== undefined && twoMoveDown && moveTwo === "arrowDown") {
		twoMoveDown = false;
	}
});

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
}

function gameLoop () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
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

var intervalId = setInterval(gameLoop, 17);

