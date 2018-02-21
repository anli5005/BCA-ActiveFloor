/* Created By Anthony Lekan 01/10/18 */
const lavaColors = ['#ffff44', '#ff6600', '#cc4422', '#553333'];
const safeColor = '#eadab5';

const marginOfError = 5;

// Whether the lava boxes are active
var screen;
var buttons;
var isFire;
var floorTiles;
var level;

var lavaBoxSize;
var secondWait;
var maxSafeTiles;

var startGameButton;
var restartButton;

var currentSecondsPast;

// What the globalTime was set to when the level started
var lastLevelStartTime;

function LavaTile(x, y, boxSize, fillStyle, globalAlpha) {
    this.x = x;
    this.y = y;
    this.boxSize = boxSize;
    this.fillStyle = fillStyle;
    this.globalAlpha = globalAlpha;
    if(fillStyle === safeColor) {
        this.isLava = false;
    } else {
        this.isLava = true;
    }
    this.isOnTile = function(x, y) {
        if(x <= this.x+boxSize-marginOfError && x >= this.x) {
            if(y <= this.y+boxSize-marginOfError && y >= this.y) {
                return true;
            }
        }
        return false;
    }
}
Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

// Create All buttons
// Inits canvas screen
function start() {
    screen = 0;
    score = 0;
    level = 0;
    buttons = [];
    lavaBoxSize = 32;
    maxSafeTiles = 2;
    currentSecondsPast = 0;
    floorTiles = [];
    isFire = false;
}

var Button = function(x, y, text, color, borderColor) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.width = (canvas.width / 2) - (context2D.measureText(text).width / 2);
    this.height = (canvas.width / 2) - (context2D.measureText(text).width / 2);
    this.bx = (canvas.width / 2) - (context2D.measureText(text).width / 2) - 15;
    this.by = context2D.measureText(text).width + 40;
    this.color = color;
    this.borderColor = borderColor;
};

function initButtons() {
    this.startGameButton = new Button(50, 50, "Hello", 5, 5, 'orange', 'red');
    this.restartButton = new Button(50, 50, "Gameover! Tap anywhere to restart!", 5, 5, 'orange', 'red');
}

function drawButton(button) {
    context2D.fillStyle = button.borderColor;
    context2D.fillRect(button.x, button.y, 50, 50);

    context2D.strokeStyle = button.color;
    context2D.strokeText(button.text, button.x, button.y);
}

function drawHomeScreen() {
    setBackground('white');

    context2D.strokeStyle = 'orange';
    context2D.strokeText("The Floor Is ", (context2D.width - context2D.measureText("The floor Is ").width)/2, 15);
    context2D.strokeStyle = 'red';
    context2D.strokeText("LAVA", (context2D.width-context2D.measureText("LAVA").width)/2, 15+context2D.measureText("LAVA").width);
}

function renderScreen(screen) {
    if(screen == 0) {
        drawHomeScreen();
    } else if(screen == 1) {
        drawLava();
        updateTimer();
        drawTimer();
    } else if(screen == 2) {

    }
}

function setBackground(color) {
    context2D.fillStyle = color;
    context2D.rect(0, 0, canvas.width, canvas.height);
}

function genSafeTiles(amount) {
    safeTileLocs = [];
    for(var i = 0; i < amount; i++) {
        var tileX = Math.floor(Math.random() * canvas.width/lavaBoxSize) * lavaBoxSize;
        var tileY = Math.floor(Math.random() * canvas.height/lavaBoxSize) * lavaBoxSize;
        safeTileLocs.append([tileX, tileY]);
        context2D.globalAlpha = 0.5;
        context2D.fillstyle = safeColor;
        context2D.fillRect(x, y, lavaBoxSize, lavaBoxSize);
        floorTiles.push(new LavaTile(tileX, tileY, lavaBoxSize, context2D.fillStyle, context2D.globalAlpha));
    }
}

function drawLava() {
    var safeTiles = 0;
    if (floorTiles.length == 0) {
        var safeTiles = genSafeTiles(Math.floor(Math.random() * maxSafeTiles) + 1);
        for (var x = 0; x < 192; x += lavaBoxSize) {
            for (var y = 0; y < 192; y += lavaBoxSize) {
                if(x == 0 && y == 0) {
                    continue;
                }
                for(i in safeTiles) {
                    if(i.x == x || i.y == y) {
                        continue;
                    }
                }
                context2D.globalAlpha = 0.5;
                context2D.fillStyle = lavaColors.random();
                context2D.fillRect(x, y, lavaBoxSize, lavaBoxSize);
                floorTiles.push(new LavaTile(x, y, lavaBoxSize, context2D.fillStyle, context2D.globalAlpha));
            }
        }
    } else {
        floorTiles.forEach(function (tile) {
            context2D.globalAlpha = tile.globalAlpha;
            context2D.fillStyle = tile.fillStyle;
            context2D.fillRect(tile.x, tile.y, tile.boxSize, tile.boxSize);
        });
    }
}

function nextLevel() {
    lastLevelStartTime = globalTime;
    currentSecondsPast = 0;
    isFire = false;
    level += 1;
    floorTiles = [];
    recalculateDifficulty();
}

function recalculateDifficulty() {
    secondWait = Math.round(5*Math.pow(Math.E, -0.000001*level));
}

function drawTimer() {
    context2D.strokeStyle = 'yellow';
    context2D.strokeRect(0, 0, 32, 32);

    context2D.strokeStyle = 'yellow';
    context2D.fontStyle = '12px Comic Sans Serif';
    if(secondWait - currentSecondsPast <= 0)
        context2D.strokeText("0", 0, 16, 32);
    else
        context2D.strokeText(secondWait - currentSecondsPast, 0, 16, 32);
}

function updateTimer() {
    if((globalTime-lastLevelStartTime) % 1000 == 0) {
        currentSecondsPast = ((globalTime - lastLevelStartTime)/1000);
    }
    if(screen == 1) {
        if (secondWait - currentSecondsPast == 0) {
            isFire = true;
        } else if (secondWait - currentSecondsPast == -1) {
            isFire = false;
            nextLevel();
        }
    }
}

function acceptInput(x, y) {
    if(screen == 0) {
        screen = 1;
        nextLevel();
    } else if(screen == 1) {
        if(isFire) {
            floorTiles.forEach(function(tile) {
                if(tile.isLava) {
                    if(tile.isOnTile(x, y)) {
                        tile.fillStyle = 'green';
                        gameOver();
                    }

                }
            });
        }
    } else {
        start();
        screen = 1;
    }
}

function gameOver() {
    screen = 2;
    isFire = false;
}
