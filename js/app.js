    'use strict';

    //Global Variables
    // Timer Variables and Counter
    let timer ='00:00';
    let seconds = 0;
    let minutes = 0;
    let timeCounter;
    let x_Move = 101;
    let y_Move = 83;
    let allGems = [];

    //Controls enemy speeds can be expanded for levels
    const speeds = [300, 200, 100];

    //Get modal and image elements from DOM
    const winnerModal = document.querySelector('.winner-modal');
    const winnerResults = document.querySelector('.winner-results');
    const winnerHeader = document.querySelector('.winner-header');
    const charModal = document.querySelector('.char-modal');
    const charBoy = document.querySelector('.char-img-boy');
    const charCatGirl = document.querySelector('.char-img-cat-girl');
    const charHornGirl= document.querySelector('.char-img-horn-girl');
    const charPinkGirl = document.querySelector('.char-img-pink-girl');
    const charPrincessGirl = document.querySelector('.char-img-princess-girl');

    // Add click events to char images to start game.
    charBoy.addEventListener('click', () => { player.sprite = 'images/char-boy.png'; toggleCharModal(); player.startGame();});
    charCatGirl.addEventListener('click', () => { player.sprite = 'images/char-cat-girl.png'; toggleCharModal(); player.startGame();});
    charHornGirl.addEventListener('click', () => { player.sprite = 'images/char-horn-girl.png'; toggleCharModal(); player.startGame();});
    charPinkGirl.addEventListener('click', () => { player.sprite = 'images/char-pink-girl.png'; toggleCharModal(); player.startGame();});
    charPrincessGirl.addEventListener('click', () => { player.sprite = 'images/char-princess-girl.png'; toggleCharModal(); player.startGame();});

    //Main Game Class
    class Game {
        constructor(x, y, sprite) {
            this.x = x;
            this.y = y;
            this.sprite = sprite;
        }

        //Reset player position on collision
        reset() {
            this.x = 202;
            this.y = 387;
        }

        //Render content to canvas
        render() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

            ctx.font = '16pt Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';

            // Draw player's score
            ctx.fillText('Lives: ' + player.lives, 395, 570);
            ctx.fillText('Score: ' + player.score, 260, 570);
            ctx.fillText('Time: ' + timer, 100, 570);
        }
    }

    // Enemies class configures enemies our player must avoid
    class Enemy extends Game {
        constructor(x, y, sprite = 'images/enemy-bug.png') {
            super(x, y = y + 55, sprite);
            this.speed = speeds[Math.floor(Math.random() * speeds.length)];
        }

        // Update the enemy's position, required method for game
        // Parameter: dt, a time delta between ticks
        update(dt) {

            //Resets if enemy is at end of screen
            if(this.x >= 404) {
                this.x = 0;
            }

            // You should multiply any movement by the dt parameter
            // which will ensure the game runs at the same speed for
            // all computers.
            this.x += this.speed * dt;
        }
    }

    // Player class with update(), render() and
    // a handleInput() method.
    class Player extends Game {
        constructor(x, y, sprite = 'images/char-boy.png') {
            super(x, y, sprite);
            this.gems = 0;
            this.moves = 0;
            this.score = 0;
            this.lives = 3;
        }

        //Start new game method. Resets variables and time
        startGame() {
            this.gems = 0;
            this.moves = 0;
            this.score = 0;
            this.lives = 3;
            seconds = 0;
            minutes = 0;
            timer = 0;
            startTimer();
        }

        handleInput(action) {
            if(action == 'left' && this.x > 0) {
                this.x -= x_Move;
            }
            else if(action == 'right' && this.x < 404) {
                this.x += x_Move;
            }
            else if(action == 'up' && this.y > 0) {
                this.y -= y_Move;
            }
            else if(action == 'down' && this.y < 387) {
                this.y += y_Move;
            }
        }

        update() {
            // Check for gem collision
            for (var i = 0; i < allGems.length; i++) {
                if ((this.x === allGems[i].x) && (this.y === allGems[i].y )) {
                    this.gems++;
                    this.score += 5;
                    allGems[i].y = 1000;
                }
            }
            // Check if player has made water. Add points
            if(this.y === -28 ) {
                this.moves++;
                this.score++;
                this.reset();
                // If player has all three gems and made water WINNER!
                if(this.gems === 3) {
                    gem.resetGems();
                    toggleFinishModal();
                    stopTimer();
                }
            }
        }
    }

    class Gem extends Game {
        constructor(x, y, sprite) {
            super();
            this.x = x;
            this.y = y;
            this.sprite = sprite;
        }
        //Clear gems for new random selection
        resetGems() {
            while (allGems.length) {
                allGems.pop();
            }
            this.createGems();
        }

        //Create GEMS array with random positions
        createGems() {
            for (var i = 0; i < 3; i++) {
                // Random column number
                this.x = getRandomNumber(0, 4) * 101;
                // Randon row number
                this.y = (getRandomNumber(1, 3) * 83) - 28;
                // Assign gem images to array
                if (i === 0) {
                    this.sprite = 'images/Gem Blue.png';
                } else if (i === 1) {
                    this.sprite = 'images/Gem Green.png';
                } else {
                    this.sprite = 'images/Gem Orange.png';
                }
                // Create new gem with location details and push to gem array
                allGems.push(new Gem(this.x, this.y, this.sprite));
            }
        }
    }

    // Now instantiate your objects.
    // Place all enemy objects in an array called allEnemies
    // Place the player object in a variable called player
    const player = new Player(202, 387);
    const enemy1 = new Enemy(-101, 0);
    const enemy2 = new Enemy(-171, 83);
    const enemy3 = new Enemy(-252.50, 166);
    const gem = new Gem();

    let allEnemies = [];
    allEnemies.push(enemy1, enemy2, enemy3);

    //Check for player enemy collisions
    function checkCollisions(allEnemies, player) {
        for (let enemy of allEnemies) {
            if((player.y === enemy.y) && (enemy.x + 65/2 > player.x) && (enemy.x < player.x + 65/2)) {
                player.moves ++;
                //If score greater than 0 remove 1 point for collision
                if(player.score > 0) {
                    player.score--;
                }
                player.lives--;
                //Call game over modal if no more lives
                if(player.lives <= 0) {
                    toggleFinishModal();
                    stopTimer();
                }
                player.reset();
            }
        }
    }

    // Call method to create GEM instances in array
    gem.createGems();

    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        player.handleInput(allowedKeys[e.keyCode]);
    });

    // Random number generator from MDN documentation
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
    function getRandomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Adds time to timer variable
    function addTime() {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
            }
        }
        timer = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
        startTimer();
    }

    // Start stopwatch timer / counter
    function startTimer() {
        timeCounter = setTimeout(addTime, 1000);
    }

    // Stop stopwatch timer / counter
    function stopTimer() {
        clearTimeout(timeCounter);
    }

    // Toggles hide class from finish modal to show and hide
    function toggleFinishModal() {
        winnerModal.classList.toggle('hide');
        if(player.lives > 0) {
            winnerHeader.innerHTML = `<h3>Congratulations you are a winner</h3>`;
            winnerResults.innerHTML =  `<span>${player.score} Points </br></br>${timer} Time </span>`;
        }
        else {
            winnerHeader.innerHTML = `<h3>Game Over</h3>`;
            winnerResults.innerHTML =  `<span>${player.lives} lives left!!</span></br></br>Please try again`;
        }
    }

    // Toggles hide class from start / char modal to show and hide
    function toggleCharModal() {
        charModal.classList.toggle('hide');
    }