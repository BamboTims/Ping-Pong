"use strict";
// Game mechanics for devices with big screens
if (window.innerWidth > 900) {
	// Ui components
	const mainMenu = document.querySelector(".menu");
	const mainMenuBtn = document.querySelector(".btn-menu");
	const playGameBtn = document.querySelector(".menu--btn");
	const popUp = document.querySelector(".menu--popup");
	const popUpBtn = document.querySelector(".menu--btn--2");
	const popUpCloseBtn = document.querySelector(".menu--popup__close");
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");
	const pauseBtn = document.querySelector(".pause__icon");
	const overlay = document.querySelector(".overlay");
	const pauseMenu = document.querySelector(".pause__menu");
	const player1ScoreText = document.querySelector(".pl1");
	const player2ScoreText = document.querySelector(".pl2");
	const app = document.querySelector(".app");
	const player1F = document.querySelector(".player--1");
	const player2F = document.querySelector(".player--2");
	const width = app.getBoundingClientRect().width;
	const height = app.getBoundingClientRect().height;
	const resumeBtn = document.querySelector(".btn-resume");
	const restartBtn = document.querySelector(".btn-restart");
	const playersGameBtn = document.querySelector(".btn-players");
	const computerGameBtn = document.querySelector(".btn-computer");

	// Paddle
	const paddleHeight = 100;
	const paddleWidth = 10;
	const paddleDiff = 25;
	const paddleY = height / 2 - paddleHeight / 2;
	let paddleLeftX = 80;
	let paddleRightX = width - 80;
	let paddleLeftY = paddleY;
	let paddleRightY = paddleY;
	let paddleContact = false;
	let wKeyPressed = false;
	let sKeyPressed = false;
	let downKeyPressed = false;
	let upKeyPressed = false;
	let pause = false;
	let gameOn = false;
	let againstPlayer = false;

	// Speed
	let speedY;
	let speedX;

	// Score
	let player1Score;
	let player2Score;
	const winningScore = 12;

	// ball
	let ballX = width / 2;
	let ballY = height / 2;
	const ballRadius = 7;

	const updateScore = function () {
		player1ScoreText.textContent = player1Score;
		player2ScoreText.textContent = player2Score;
	};

	// Create canvas Element
	const createCanvas = function () {
		canvas.height = height;
		canvas.width = width;
		app.appendChild(canvas);
		renderCanvas();
	};

	// Canvas rendering
	const renderCanvas = function () {
		// Canvas Background
		context.fillStyle = "rgba(0,0,0,0.2)";
		context.fillRect(0, 0, width, height);

		context.fillStyle = "white"; //Paddle color

		// Player Paddle(left & right)
		context.fillRect(paddleLeftX, paddleLeftY, paddleWidth, paddleHeight);
		context.fillRect(paddleRightX, paddleRightY, paddleWidth, paddleHeight);

		// Ball
		context.beginPath();
		context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false);
		context.fillStyle = "white";
		context.fill();
		context.closePath();
	};

	const ballReset = function () {
		ballX = width / 2;
		ballY = height / 2;
		paddleLeftY = paddleRightY = paddleY;
		paddleContact = false;
	};

	const ballMove = function () {
		ballX += speedX;

		if (paddleContact) {
			ballY += speedY;
		}
	};

	// Wall & Paddle rebound physics
	const gameBoundaries = function () {
		if (ballY + ballRadius > height) {
			speedY = -speedY;
		}
		if (ballY + ballRadius < 0) {
			speedY = -speedY;
		}

		if (
			ballX > paddleLeftX &&
			ballX < paddleLeftX + paddleWidth &&
			ballY > paddleLeftY &&
			ballY < paddleLeftY + paddleHeight
		) {
			speedX = -speedX;
			paddleContact = true;
		}
		if (
			ballX > paddleRightX &&
			ballX < paddleRightX + paddleWidth &&
			ballY > paddleRightY &&
			ballY < paddleRightY + paddleHeight
		) {
			speedX = -speedX;
			paddleContact = true;
		}
	};

	// !Need to update to win computer
	const gameAi = function () {
		paddleRightY = ballY - 35;
	};

	const gamePoint = function () {
		if (ballX + ballRadius < 0) {
			player2Score++;
			ballReset();
		} else if (ballX + ballRadius > width) {
			player1Score++;
			ballReset();
		}
	};

	function keyDownHandler(e) {
		if (e.key === "Up" || e.key === "ArrowUp") {
			upKeyPressed = true;
		} else if (e.key === "Down" || e.key === "ArrowDown") {
			downKeyPressed = true;
		} else if (e.key === "w") {
			wKeyPressed = true;
		} else if (e.key === "s") {
			sKeyPressed = true;
		}
	}

	function keyUpHandler(e) {
		if (e.key === "Up" || e.key === "ArrowUp") {
			upKeyPressed = false;
		} else if (e.key == "Down" || e.key == "ArrowDown") {
			downKeyPressed = false;
		} else if (e.key === "w") {
			wKeyPressed = false;
		} else if (e.key === "s") {
			sKeyPressed = false;
		}
	}
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

	const paddleMovement = function () {
		if (upKeyPressed && !againstPlayer) {
			0 < paddleLeftY ? (paddleLeftY -= 10) : (paddleLeftY -= 0);
		} else if (downKeyPressed && !againstPlayer) {
			height > paddleLeftY + paddleHeight
				? (paddleLeftY += 10)
				: (paddleLeftY += 0);
		}

		if (upKeyPressed && againstPlayer) {
			0 < paddleRightY ? (paddleRightY -= 10) : (paddleRightY -= 0);
		} else if (downKeyPressed && againstPlayer) {
			height > paddleRightY + paddleHeight
				? (paddleRightY += 10)
				: (paddleRightY += 0);
		}

		if (wKeyPressed && againstPlayer) {
			0 < paddleLeftY ? (paddleLeftY -= 10) : (paddleLeftY -= 0);
		} else if (sKeyPressed && againstPlayer) {
			height > paddleLeftY + paddleHeight
				? (paddleLeftY += 10)
				: (paddleLeftY += 0);
		}
	};

	const gameOver = function () {
		if (player1Score === winningScore || player2Score === winningScore) {
			if (player1Score === winningScore) {
				player1ScoreText.textContent = "Winner!";
				player1F.classList.add("player--winner");
			} else if (player2Score === winningScore) {
				player2ScoreText.textContent = "Winner!";
				player2F.classList.add("player--winner");
			}
			pause = true;
		}
	};

	const newGame = function () {
		cancelAnimationFrame(newGame);
		createCanvas();
		if (!pause) ballMove();
		gameBoundaries();
		gamePoint();
		updateScore();
		if (!againstPlayer) gameAi();
		paddleMovement();
		gameOver();
		requestAnimationFrame(newGame);
	};

	const newGameSettings = function () {
		if (!mainMenu.classList.contains("hidden")) {
			mainMenu.classList.add("hidden");
			app.classList.remove("hidden");
		}
		speedY = -10;
		speedX = speedY;
		ballReset();
		gameOn = true;
		player1F.classList.remove("player--winner");
		player2F.classList.remove("player--winner");
		pause = false;
		player1Score = 0;
		player2Score = 0;
		newGame();
	};

	const openModal = function () {
		overlay.classList.remove("hidden");
		pauseMenu.classList.remove("hidden");
		pause = true;
	};

	const closeModal = function () {
		overlay.classList.add("hidden");
		pauseMenu.classList.add("hidden");
		pause = false;
	};

	pauseBtn.addEventListener("click", (e) => {
		e.preventDefault();
		if (overlay.classList.contains("hidden") && gameOn) {
			openModal();
		} else {
			closeModal();
		}
	});

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && overlay.classList.contains("hidden") && gameOn) {
			openModal();
		} else {
			closeModal();
		}
	});

	playGameBtn.addEventListener("click", newGameSettings);

	resumeBtn.addEventListener("click", closeModal);
	restartBtn.addEventListener("click", () => {
		cancelAnimationFrame(newGame);
		closeModal();
		newGameSettings();
	});

	mainMenuBtn.addEventListener("click", () => {
		cancelAnimationFrame(newGame);
		app.classList.add("hidden");
		mainMenu.classList.remove("hidden");
		closeModal();
		gameOn = false;
	});

	playersGameBtn.addEventListener("click", () => {
		againstPlayer = true;
		closeModal();
		newGameSettings();
	});

	computerGameBtn.addEventListener("click", () => {
		againstPlayer = false;
		closeModal();
		newGameSettings();
	});

	popUpBtn.addEventListener("click", () => popUp.classList.toggle("hidden"));
	popUpCloseBtn.addEventListener("click", () =>
		popUp.classList.toggle("hidden")
	);
}
