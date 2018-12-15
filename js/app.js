//Global Variables
// Timer Variables and Counter
let timer ='00:00';
let seconds = 0;
let minutes = 0;
let timeCounter;

// Place all gem objects in an array called allGems
let allGems = [];

//Get modal and image elements from DOM
const winnerModal = document.querySelector('.winner-modal');
const winnerResults = document.querySelector('.winner-results');
const replayButton = document.querySelector('.replay-button');
const charModal = document.querySelector('.char-modal');
const charBoy = document.querySelector('.char-img-boy');
const charCatGirl = document.querySelector('.char-img-cat-girl');
const charHornGirl= document.querySelector('.char-img-horn-girl');
const charPinkGirl = document.querySelector('.char-img-pink-girl');
const charPrincessGirl = document.querySelector('.char-img-princess-girl');

//Add click event to replay button on finish maodal
replayButton.addEventListener('click', () => {
    toggleFinishModal();
    toggleCharModal();
    player.reset();
});

// Add click events to char images to start game.
charBoy.addEventListener('click', () => { player.sprite = 'images/char-boy.png'; toggleCharModal(); player.startGame();});
charCatGirl.addEventListener('click', () => { player.sprite = 'images/char-cat-girl.png'; toggleCharModal(); player.startGame();});
charHornGirl.addEventListener('click', () => { player.sprite = 'images/char-horn-girl.png'; toggleCharModal(); player.startGame();});
charPinkGirl.addEventListener('click', () => { player.sprite = 'images/char-pink-girl.png'; toggleCharModal(); player.startGame();});
charPrincessGirl.addEventListener('click', () => { player.sprite = 'images/char-princess-girl.png'; toggleCharModal(); player.startGame();});

// Enemies our player must avoid
let Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    this.enemy_x = x;
    this.enemy_y = y + 55;
    this.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.enemy_x < 404) {
        this.enemy_x += this.speed * dt;
    }
    else {
        this.enemy_x = 0;
        this.speed = 100 + Math.floor(Math.random() * 100);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.enemy_x, this.enemy_y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

let Player = function() {
    this.sprite = 'images/char-boy.png';
    this.horizontalMove = 101;
    this.verticalMove = 83;
    this.player_x = 202;
    this.player_y = 387;
    this.moves = 0;
    this.score = 0;
    this.gems = 0;
};

Player.prototype.handleInput = function(action) {
    if(action == 'left' && this.player_x > 0) {
        this.player_x -= this.horizontalMove;
    }
    else if(action == 'right' && this.player_x < 404) {
        this.player_x += this.horizontalMove;
    }
    else if(action == 'up' && this.player_y > 0) {
        this.player_y -= this.verticalMove;
    }
    else if(action == 'down' && this.player_y < 387) {
        this.player_y += this.verticalMove;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.player_x, this.player_y);

    ctx.font = '16pt Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';

    // Draw player's score
    ctx.fillText('Score: ' + this.score, 353, 80);
    ctx.fillText('Time: ' + timer, 120, 80);
};

Player.prototype.update = function() {
    let enemy;
    for (enemy of allEnemies) {
        if((this.player_y === enemy.enemy_y) && (enemy.enemy_x + 65/2 > this.player_x) && (enemy.enemy_x < this.player_x + 65/2)) {
            this.moves ++;
            //If scroe greater than remove 1 for collision
            if(this.score > 0) {
                this.score--;
            }
            player.reset();
        }

        // Check for gem collision
        for (var i = 0; i < allGems.length; i++) {
            if ((this.player_x === allGems[i].x) && (this.player_y === allGems[i].y )) {
                this.gems++;
                this.score += 5;
                allGems[i].y = 1000;
            }
        }
        // Check if player has made water. Add points
        if(this.player_y === -28 ) {
            this.moves++;
            this.score++;
            player.reset();
            // If player has all three gems and made water WINNER!
            if(this.gems === 3){
                player.resetGems();
                toggleFinishModal();
                stopTimer();
            }
        }
    }
};

Player.prototype.reset = function(){
    this.player_x = 202;
    this.player_y = 387;
};

// Cleans up GEMS array for a new random number list
Player.prototype.resetGems = function() {
    var gemsArrayLength = allGems.length;
   for (var x = 0; x < gemsArrayLength; x++) {
       allGems.pop();
   }
   createGems();
};

// Start new game. Clears scores and starts timer
Player.prototype.startGame = function() {
    player.gems = 0;
    player.moves = 0;
    player.score = 0;
    seconds = 0;
    minutes = 0;
    timer = 0;
    startTimer();
}

// GEM object for creating gem instances
var Gem = function(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};

// GEM Render method for drawing the gem on the screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Random number generator from MDN documentation
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Creating a array for gem instances / shuffled via random number generator
function createGems() {
    for (var i = 0; i < 3; i++) {
        // Random column number
        var col = getRandomNumber(0, 4) * 101;
        // Randon row number
        var row = (getRandomNumber(1, 3) * 83) - 28;
        // Assign gem images to array
        if (i === 0) {
            sprite = 'images/Gem Blue.png';
        } else if (i === 1) {
            sprite = 'images/Gem Green.png';
        } else {
            sprite = 'images/Gem Orange.png';
        }
        // Create new gem with location details and push to gem array
        allGems.push(new Gem(col, row, sprite));
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const enemy1 = new Enemy(-101, 0, 200);
const enemy2 = new Enemy(-101, 83, 400);
const enemy3 = new Enemy((-252.50) , 166, 300);
const player = new Player();

const allEnemies = [];
allEnemies.push(enemy1, enemy2, enemy3);

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
    winnerResults.innerHTML =  `<span>${player.score} Points </br>${timer} Time </span>`;
}

// Toggles hide class from start / char modal to show and hide
function toggleCharModal() {
    charModal.classList.toggle('hide');
}