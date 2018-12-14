


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
        this.time = 0;
        this.winner = false;
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

    ctx.font = '16pt Chango';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
  
    // Draw player's score
    ctx.fillText('Score: ' + this.moves, 353, 80);
    // Draw player's number of gems
    ctx.fillText('Gems: ' + this.gems, 230, 80);
};

Player.prototype.update = function() {
    let enemy;
        for (enemy of allEnemies) {
            if((this.player_y === enemy.enemy_y) && (enemy.enemy_x + 65/2 > this.player_x) && (enemy.enemy_x < this.player_x + 65/2)) {
                this.moves ++;
                player.reset();
            }

            // Check for gem collision
            for (var i = 0; i < allGems.length; i++) {
               
                if ((this.player_x === allGems[i].x) && (this.player_y === allGems[i].y )) {                   
                    this.gems++;                 
                    allGems[i].y = 1000;
                }
            }

            if(this.player_y === -28 ) {
                this.moves++;
             
                player.reset();
                if(this.gems === 3){
                    player.resetGems();
                    this.gems = 0;
                    this.winner = true;
                }
               
           }
        }
};

Player.prototype.reset = function(){
    this.player_x = 202;
    this.player_y = 387;
};

Player.prototype.resetGems = function() {
    var gemsArrayLength = allGems.length;
   for (var x = 0; x < gemsArrayLength; x++) {
       allGems.pop();
   }
   createGems();
};

var Gem = function(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};

// Draw the gem on the screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Random number generator from MDN documentation
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
// Global_Objects/Math/random
function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Instantiate gem objects
// Place all gem objects in an array called allGems
var allGems = [];

// Creates an array of 3 gem instances
function createGems() {
    for (var i = 0; i < 3; i++) {
        // Pick random col for gem to be on
        var col = getRandomNumber(0, 4) * 101;
        console.log('col ' + col);
        // Pick random row of stones for gem to be on
        var row = (getRandomNumber(1, 3) * 83) - 28;
        console.log('row ' + row);
        // Assign gem image
        if (i === 0) {
            sprite = 'images/Gem Blue.png';
        } else if (i === 1) {
            sprite = 'images/Gem Green.png';
        } else {
            sprite = 'images/Gem Orange.png';
        }
        // Create gem instance
        allGems.push(new Gem(col, row, sprite));
        
    }
    console.log('Gems 1 ' + allGems[0].x + ' y' + allGems[0].y);
    console.log('Gems 2 ' + allGems[1].x + ' y' + allGems[1].y);
    console.log('Gems 3 ' + allGems[2].x + ' y' + allGems[2].y);
};

createGems();

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const enemy1 = new Enemy(-101, 0, 200);
const enemy2 = new Enemy(-101, 83, 400);
const enemy3 = new Enemy((-252.50) , 166, 300);
const player = new Player();

const allEnemies = [];
allEnemies.push(enemy1, enemy2, enemy3);

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



