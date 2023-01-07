"use strict";
// Game mechanics for devices with big screens
if (window.innerWidth < 900) {
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
	const paddleHeight = 10;
	const paddleWidth = 100;
	const paddleX = width / 2 - paddleWidth / 2;
	let paddleUpY = 40;
	let paddleDownY = height - 40;
	let paddleUpX = paddleX;
	let paddleDownX = paddleX;
	let paddleContact = false;
	let aKeyPressed = false;
	let dKeyPressed = false;
	let rightKeyPressed = false;
	let leftKeyPressed = false;
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
		context.fillRect(paddleUpX, paddleUpY, paddleWidth, paddleHeight);
		context.fillRect(paddleDownX, paddleDownY, paddleWidth, paddleHeight);

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
		paddleUpX = paddleDownX = paddleX;
		paddleContact = false;
	};

	const ballMove = function () {
		ballY += speedY;

		if (paddleContact) {
			ballX += speedX;
		}
	};

	// Wall & Paddle rebound physics
	const gameBoundaries = function () {
		if (ballX + ballRadius > width) {
			speedX = -speedX;
		}
		if (ballX + ballRadius < 0) {
			speedX = -speedX;
		}

		if (
			ballX > paddleUpX &&
			ballX < paddleUpX + paddleWidth &&
			ballY > paddleUpY &&
			ballY < paddleUpY + paddleHeight
		) {
			speedY = -speedY;
			paddleContact = true;
		}
		if (
			ballX > paddleDownX &&
			ballX < paddleDownX + paddleWidth &&
			ballY > paddleDownY &&
			ballY < paddleDownY + paddleHeight
		) {
			speedY = -speedY;
			paddleContact = true;
		}
	};

	// !Need to update to win computer
	const gameAi = function () {
		paddleDownX = ballX - 35;
	};

	const gamePoint = function () {
		if (ballY + ballRadius < 0) {
			player2Score++;
			ballReset();
		} else if (ballY + ballRadius > height) {
			player1Score++;
			ballReset();
		}
	};

	function keyDownHandler(e) {
		if (e.key === "Left" || e.key === "ArrowLeft") {
			leftKeyPressed = true;
		} else if (e.key === "Right" || e.key === "ArrowRight") {
			rightKeyPressed = true;
		} else if (e.key === "a") {
			aKeyPressed = true;
		} else if (e.key === "d") {
			dKeyPressed = true;
		}
	}

	function keyUpHandler(e) {
		if (e.key === "Left" || e.key === "ArrowLeft") {
			leftKeyPressed = false;
		} else if (e.key == "Right" || e.key == "ArrowRight") {
			rightKeyPressed = false;
		} else if (e.key === "a") {
			aKeyPressed = false;
		} else if (e.key === "d") {
			dKeyPressed = false;
		}
	}
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

	const paddleMovement = function () {
		if (leftKeyPressed && !againstPlayer) {
			0 < paddleUpX ? (paddleUpX -= 10) : (paddleUpX -= 0);
		} else if (rightKeyPressed && !againstPlayer) {
			width > paddleUpX + paddleWidth
				? (paddleUpX += 10)
				: (paddleUpX += 0);
		}

		if (leftKeyPressed && againstPlayer) {
			0 < paddleDownX ? (paddleDownX -= 10) : (paddleDownX -= 0);
		} else if (rightKeyPressed && againstPlayer) {
			height > paddleDownX + paddleHeight
				? (paddleDownX += 10)
				: (paddleDownX += 0);
		}

		if (aKeyPressed && againstPlayer) {
			0 < paddleUpX ? (paddleUpX -= 10) : (paddleUpX -= 0);
		} else if (dKeyPressed && againstPlayer) {
			height > paddleUpX + paddleHeight
				? (paddleUpX += 10)
				: (paddleUpX += 0);
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
		speedY = -5;
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
	restartBtn.addEventListener("click", (e) => {
		e.preventDefault();
		closeModal();
		ballReset();
		newGameSettings();
	});

	mainMenuBtn.addEventListener("click", () => {
		cancelAnimationFrame(newGame);
		app.classList.add("hidden");
		mainMenu.classList.remove("hidden");
		closeModal();
		gameOn = false;
	});

	playersGameBtn.addEventListener("click", (e) => {
		e.preventDefault();
		againstPlayer = true;
		closeModal();
		newGameSettings();
	});

	computerGameBtn.addEventListener("click", (e) => {
		e.preventDefault();
		againstPlayer = false;
		closeModal();
		newGameSettings();
	});

	popUpBtn.addEventListener("click", () => popUp.classList.toggle("hidden"));
	popUpCloseBtn.addEventListener("click", () =>
		popUp.classList.toggle("hidden")
	);
}
