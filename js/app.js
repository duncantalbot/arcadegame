
    'use strict';
    //Global Variables
    // Timer Variables and Counter
    let timer ='00:00';
    let seconds = 0;
    let minutes = 0;
    let timeCounter;
    
    let allGems = [];
    let gameStatus = 'Started';

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
        constructor() {
            this.x;
            this.y;
            this.speed;
            this.sprite;

            this.score = 0;
            this.lives = 3;
        }

        reset() {
            this.gems = 0;
            this.moves = 0;
            this.score = 0;
            this.lives = 3;
            seconds = 0;
            minutes = 0;
            timer = 0;
            this.x = 202;
            this.y = 387;
            gameStatus = 'Started';
        }

        render () {
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

    // Enemies our player must avoid
    class Enemy extends Game {
        constructor(x, y, speed) {
            // Variables applied to each of our instances go here,
            // we've provided one for you to get started
            super();
            this.x = x;
            this.y = y + 55;
            this.speed = speed;

            // The image/sprite for our enemies, this uses
            // a helper we've provided to easily load images
            this.sprite = 'images/enemy-bug.png';
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

    // Now write your own player class
    // This class requires an update(), render() and
    // a handleInput() method.
    class Player extends Game {
        constructor() {
            super();
            this.sprite = 'images/char-boy.png';
            this.horizontalMove = 101;
            this.verticalMove = 83;
            this.x = 202;
            this.y = 387;
            this.moves = 0;
            this.gems = 0;
        }

        startGame() {
            startTimer();
            gameStatus = 'Started';
        }

        handleInput(action) {
            if(action == 'left' && this.x > 0) {
                this.x -= this.horizontalMove;
            }
            else if(action == 'right' && this.x < 404) {
                this.x += this.horizontalMove;
            }
            else if(action == 'up' && this.y > 0) {
                this.y -= this.verticalMove;
            }
            else if(action == 'down' && this.y < 387) {
                this.y += this.verticalMove;
            }
        }

        update() {
            let enemy;
            for (enemy of allEnemies) {
                if((this.y === enemy.y) && (enemy.x + 65/2 > this.x) && (enemy.x < this.x + 65/2)) {
                    this.moves ++;
                    //If score greater than 0 remove 1 point for collision
                    if(this.score > 0) {
                        this.score--;
                    }
                    this.lives--;
                    //Call gamove modal if no more lives
                    if(this.lives <= 0)
                    {
                        toggleFinishModal();
                        gameStatus = 'Stopped';
                        stopTimer();
                    }
                    this.resetPlayer();
                }

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
                    this.resetPlayer();
                    // If player has all three gems and made water WINNER!
                    if(this.gems === 3){
                        gem.resetGems();
                        toggleFinishModal();
                        gameStatus = 'Stopped';
                        stopTimer();
                    }
                }
            }
        }

        resetPlayer() {
            this.x = 202;
            this.y = 387;
        }

    };

    class Gem extends Game {
        constructor(x, y, sprite) {
            super();
            this.x = x;
            this.y = y;
            this.sprite = sprite;
        }

        resetGems(){
            let gemsArrayLength = allGems.length;
            for (let x = 0; x < gemsArrayLength; x++) {
                allGems.pop();
            }
            createGems();
       }
    };

    // Now instantiate your objects.
    // Place all enemy objects in an array called allEnemies
    // Place the player object in a variable called player
    const enemy1 = new Enemy(-101, 0, 100);
    const enemy2 = new Enemy(-171, 83, 300);
    const enemy3 = new Enemy((-252.50) , 166, 200);
    const player = new Player();
    const gem = new Gem();

    let allEnemies = [];
    allEnemies.push(enemy1, enemy2, enemy3);

    // Random number generator from MDN documentation
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
    function getRandomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Creating a array for gem instances / shuffled via random number generator
    function createGems() {
    let gemSprite;

        for (var i = 0; i < 3; i++) {
            // Random column number
            var col = getRandomNumber(0, 4) * 101;
            // Randon row number
            var row = (getRandomNumber(1, 3) * 83) - 28;
            // Assign gem images to array
            if (i === 0) {
                gemSprite = 'images/Gem Blue.png';
            } else if (i === 1) {
                gemSprite = 'images/Gem Green.png';
            } else {
                gemSprite = 'images/Gem Orange.png';
            }
            // Create new gem with location details and push to gem array
            let newGem = new Gem(col, row, gemSprite);

            allGems.push(newGem);
        }
    }

    // Call method to create GEM instances in array
    createGems();

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
        if(player.lives > 0){
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
