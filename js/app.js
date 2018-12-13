



// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

this.x = x;
this.y = y + 65;
this.speed = speed;
//this.horizontalMove = 101;
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
    if(this.x < 550) {
        this.x += this.speed * dt;
        
    }
    else {
        this.x = 0;
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class MainPlayer {
    constructor() {
        this.sprite = 'images/char-boy.png';
       
        this.horizontalMove = 101;
        this.verticalMove = 83;

        this.x = 202;
        this.y = 505;
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
        else if(action == 'down' && this.y < 332) {
            this.y += this.verticalMove;
        }
    }

    render () {
        console.log(this.x + ' ' + this.y);
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    update() {
        let enemy;
        for (enemy of allEnemies) {
            if(this.y = enemy.y){
                //alert('collide');
            }
            //console.log(this.y + ' ' + enemy.y)
        }
    }

    checkCollisions()  {

    }

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const enemy1 = new Enemy(-101, 0, 200);
const enemy2 = new Enemy(-101, 83, 250);
const enemy3 = new Enemy((-101 * 2), 170, 300);
const player = new MainPlayer();
const allEnemies = [];
allEnemies.push(enemy1, enemy2, enemy3);
console.log(allEnemies);

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
