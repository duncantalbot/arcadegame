



// Enemies our player must avoid
var Enemy = function(x, y, speed) {
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
        let newSpeed = Math.floor(Math.random() * 5 + 1);
        this.speed = 100 * newSpeed;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.enemy_x, this.enemy_y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class MainPlayer {
    constructor() {
        this.sprite = 'images/char-boy.png';       
        this.horizontalMove = 101;
        this.verticalMove = 83;
        this.player_x = 202;
        this.player_y = 387;

        this.gem1 =  'images/Gem Blue.png';
        this.gem2 =  'images/Gem Green.png';
        this.gem3 =  'images/Gem Orange.png';
        this.gem4 =  'images/Heat.png';
        this.gem5 =  'images/Key.png';

        const gemList = [];
        gemList.push(this.gem1, this.gem2, this.gem3, this.gem4, this.gem5);
        console.log(gemList);

        //Shuffle card pack
        const shuffledGems = shuffle(gemList);
        console.log(shuffledGems);

        
 
    // Shuffle function from http://stackoverflow.com/a/2450976
    

    }

    handleInput(action) {
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
    }

    render () {
        //console.log(this.x + ' ' + this.player_y);
        ctx.drawImage(Resources.get(this.sprite), this.player_x, this.player_y);

        ctx.drawImage(Resources.get(this.sprite), 81, 101);
    }

    update() {
        let enemy;
        for (enemy of allEnemies) {
            if((this.player_y === enemy.enemy_y) && 
                (enemy.enemy_x + 65/2 > this.player_x) && 
                (enemy.enemy_x < this.player_x + 65/2)) {
                alert('collide');
                player.reset();
            }
            if(this.player_y === -28) {
               //alert('winner');
               //switch if square 1 get 1 image from array and display
               ctx.drawImage(Resources.get(this.sprite), 200, 200);
               player.reset();
                
           }
           // console.log('Player Y: ' + this.player_y + ' Enemy Y: ' + enemy.enemy_y );
            //console.log('Player X: ' + this.player_x + ' Enemy X: ' + enemy.enemy_x);
        }

        
    }

    checkCollisions()  {

    }

    reset() {
      if(status) {

      }
      else{

      }
            this.player_x = 202;
        this.player_y = 387;
      
        
    }

}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const enemy1 = new Enemy(-101, 0, 200);
const enemy2 = new Enemy(-101, 83, 400);
const enemy3 = new Enemy((-252.50) , 166, 300);
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
