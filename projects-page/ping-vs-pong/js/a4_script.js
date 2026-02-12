const svgNS = "http://www.w3.org/2000/svg";

// Balls + Speeds
let ballSpeed = 5;
let paddleSpeed = 5;
let ballVelocityX = ballSpeed;
let ballVelocityY = ballSpeed;
const speedMultiplier = 1.05; 

// Scoring
let player1Score = 0;
let player2Score = 0;
const scoreGoal = 11;
const winByTwo = 2;

// Paddles
let paddleOneY = 215;
let paddleTwoY = 215;
let paddleOneDirection = 0; 
let paddleTwoDirection = 0;

// Buttons
const startButton = document.querySelector("#start-button");

window.addEventListener("load", function() {

    function tableLines() {

        // Create the solid horizontal center line
        let horizontalLine = document.createElementNS(svgNS, "line");
        horizontalLine.setAttribute("x1", 0);   
        horizontalLine.setAttribute("y1", 245); 
        horizontalLine.setAttribute("x2", 900); 
        horizontalLine.setAttribute("y2", 245); 
        horizontalLine.setAttribute("stroke", "#0070E0");
        horizontalLine.setAttribute("stroke-width", 5);

        // Create the dashed vertical center line (net)
        let netLine = document.createElementNS(svgNS, "line");
        netLine.setAttribute("x1", 450); 
        netLine.setAttribute("y1", 5);  
        netLine.setAttribute("x2", 450);
        netLine.setAttribute("y2", 495);
        netLine.setAttribute("stroke", "white");
        netLine.setAttribute("stroke-width", 5);
        netLine.setAttribute("stroke-dasharray", "10, 10");
    
        // Append lines to the SVG
        const svg = document.querySelector("svg");
        svg.appendChild(horizontalLine);
        svg.appendChild(netLine);
    }
    

    function createBall() {
        let ball = document.createElementNS(svgNS, "circle");

        // Center spawn for the ball 
        ball.setAttribute("cx", 450);
        ball.setAttribute("cy", 245);
        ball.setAttribute("r", 10);
        ball.setAttribute("fill", "white");

        document.querySelector("svg").appendChild(ball);
        return ball;
    }

    function createPaddle(x, y) {
        let paddle = document.createElementNS(svgNS, "rect");

        paddle.setAttribute("width", 10);
        paddle.setAttribute("height", 60);
        paddle.setAttribute("x", x);
        paddle.setAttribute("y", y);
        paddle.setAttribute("fill", "white");

        document.querySelector("svg").appendChild(paddle);
        return paddle;
    }

    function movePaddles() {
        
        // P1
        paddleOneY += paddleOneDirection * paddleSpeed;
        paddleOneY = Math.max(0, Math.min(420, paddleOneY));
        paddleOne.setAttribute("y", paddleOneY);

        // P2
        paddleTwoY += paddleTwoDirection * paddleSpeed;
        paddleTwoY = Math.max(0, Math.min(420, paddleTwoY)); 
        paddleTwo.setAttribute("y", paddleTwoY);

        requestAnimationFrame(movePaddles);
    }

    function moveBall() {

        
        let cx = parseFloat(ball.getAttribute("cx"));
        let cy = parseFloat(ball.getAttribute("cy"));

        cx += ballVelocityX;
        cy += ballVelocityY;

        // Wall collision (top and bottom)
        if (cy - 10 <= 0 || cy + 30 >= 500) {
            ballVelocityY *= -1;
        }

        // Paddle collision (left paddle)
        let paddleOneY = parseFloat(paddleOne.getAttribute("y"));
        if (cx - 10 <= 20 && cy >= paddleOneY && cy <= paddleOneY + 60) {
            ballVelocityX *= -1;
            ballVelocityX *= speedMultiplier;
            ballVelocityY *= speedMultiplier;
        }

        // Paddle collision (right paddle)
        let paddleTwoY = parseFloat(paddleTwo.getAttribute("y"));
        if (cx + 10 >= 880 && cy >= paddleTwoY && cy <= paddleTwoY + 60) {
            ballVelocityX *= -1;
            ballVelocityX *= speedMultiplier;
            ballVelocityY *= speedMultiplier;
        }

        // Update ball coordinates
        ball.setAttribute("cx", cx);
        ball.setAttribute("cy", cy);

        // Check if the ball goes past the left or right paddle (score)
        if (cx <= 0) {
            updateScore(2);  // Player 2 scores
        }

        if (cx >= 900) {
            updateScore(1);  // Player 1 scores
        }

        requestAnimationFrame(moveBall);
    }

    // Updating score when ball gets past paddle, advantage goes to scorer 
    function updateScore(scoringPlayer) {
        if (scoringPlayer === 1) {
            scoringPlayer = -1;
            player1Score++;
            document.querySelector("#player-1-score").textContent = player1Score;
        } 
        else if (scoringPlayer === 2) {
            scoringPlayer = 1;
            player2Score++;
            document.querySelector("#player-2-score").textContent = player2Score;
        }
    
        // Check for win condition (11 points and 2-point lead)
        if ((player1Score >= scoreGoal || player2Score >= scoreGoal) && Math.abs(player1Score - player2Score) >= winByTwo) {
            const winner = player1Score > player2Score ? "Player 1" : "Player 2";
            gameOver(winner);
            return;
        }

        // Reset ball speed and direction towards scorer
        ballVelocityX = ballSpeed * scoringPlayer;  
        ballVelocityY = ballSpeed;
    
        ball.setAttribute("cx", 450);
        ball.setAttribute("cy", 245);
    }
    
    // Start Game with button or spacebar   
    function startGame() {
        startButton.disabled = true;
        startButton.style.opacity = "0";

        moveBall();
        movePaddles();
    }

    // Button click and Spacebar functionality to start game
    startButton.addEventListener("click", startGame);
    window.addEventListener("keydown", function(event) {
        if (event.code === "Space" && !startButton.disabled) {
            startGame();
        }
    });

    // Game Over functionality
    function gameOver(winner) {

        // Stop the ball movement
        ballVelocityX = 0;
        ballVelocityY = 0;

        // Reset ball position to center
        ball.setAttribute("cx", 450);
        ball.setAttribute("cy", 245);
        
        // Create game over message div with content
        const gameOverMessage = document.createElement("div");
        gameOverMessage.id = "game-over";
        gameOverMessage.innerHTML = `
            <h2>${winner} Wins!</h2>
            <button id="restart-game">Restart</button>`;
        document.querySelector("main").appendChild(gameOverMessage);
    
        // Restart button functionality
        document.querySelector("#restart-game").addEventListener("click", function() {
            
            gameOverMessage.remove();
    
            // Reset scores and display
            player1Score = 0;
            player2Score = 0;
            document.querySelector("#player-1-score").textContent = player1Score;
            document.querySelector("#player-2-score").textContent = player2Score;

            // Reset ball speed to initial speed
            ballVelocityX = ballSpeed;
            ballVelocityY = ballSpeed;
        });
    }
    
    
    // Paddle movement
    window.addEventListener("keydown", function(event) {
        switch (event.key) {
            case "w":
                paddleOneDirection = -1;
                break;
            case "s":
                paddleOneDirection = 1;
                break;
            case "i":
                paddleTwoDirection = -1;
                break;
            case "k":
                paddleTwoDirection = 1;
                break;
        }
    });

    window.addEventListener("keyup", function(event) {
        switch (event.key) {
            case "w":
            case "s":
                paddleOneDirection = 0;
                break;
            case "i":
            case "k":
                paddleTwoDirection = 0;
                break;
        }
    });

    // Create the table line, ball and paddles
    tableLines();
    const ball = createBall();
    const paddleOne = createPaddle(10, 215);  // Player 1 paddle
    const paddleTwo = createPaddle(880, 215); // Player 2 paddle
    
});
