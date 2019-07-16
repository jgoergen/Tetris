var Tetris = function (_divId, _junkProb, _junkHeight, _updateSpeed, _blockSize, _width, _height) {

    var thisRef = this;

    this.blockSize = 0;
    this.lines = 0;
    this.blocks = 0;
    this.piecetot = 0;
    this.running = false;
    this.canvas = null;
    this.ctx = null;
    this.updateSpeed = 0;
    this.pieces = null;

    // MAP STUFF ///////////////////////////////////////////////////////////////////
    this.map = null;
    this.mapHeight = 0;
    this.mapWidth = 0;
    this.ggID = 0;
    this.focusedPieceIndex = 0;

    this.pieceArr = new Array("square", "pipe", "leftz", "rightz", "leftl", "rightl", "triangle");
    this.colors = new Array("red", "green", "blue", "darkred", "darkgreen", "darkblue");
            
    this.setup = function (_divId, _junkProb, _junkHeight, _updateSpeed, _blockSize, _height, _width) {
        
        thisRef.canvas = document.getElementById(_divId);
        thisRef.ctx = thisRef.canvas.getContext('2d');

        /*
        thisRef.dropSpeed = (Math.floor(Math.random() * 300) + 100);
        thisRef.junkHeight = (Math.floor(Math.random() * 10) + 4);
        thisRef.junkProb = (Math.floor(Math.random() * 40) + 20);
        */

        thisRef.blockSize = _blockSize;
        thisRef.updateSpeed = _updateSpeed;

        // init map
        thisRef.map = new Map(_width, _height, _blockSize);
        
        // add junk
        thisRef.map.fillWithJunk(_junkProb, _junkHeight);

        // make first piece
        thisRef.pieces = new Array();
        thisRef.pieces.push(new Piece(thisRef.pieceArr[Math.floor(Math.random() * thisRef.pieceArr.length)], 7, 0, thisRef.blockSize));
        thisRef.focusedPieceIndex = (thisRef.pieces.length - 1);
        thisRef.piecetot++;
        
        thisRef.attachHandlers();

        thisRef.running = true;

        console.log("game starting");

        setTimeout(function () { thisRef.gameLoop(); }, 0);
    }

    this.attachHandlers = function () {

        document.onkeyup = thisRef.handleKeyUp;
    }

    this.detachHandlers = function () {

        document.onkeyup = null;
    }

    this.handleKeyUp = function (e) {

        if (thisRef.pieces[thisRef.focusedPieceIndex].dead == false) {

            switch (e.which) {

                case 38: // up
                    thisRef.adjustPiece(thisRef.focusedPieceIndex, "rotright");
                    thisRef.draw();
                    break;

                case 40: // down
                    thisRef.adjustPiece(thisRef.focusedPieceIndex, "down");
                    thisRef.draw();
                    break;

                case 37: // left
                    thisRef.adjustPiece(thisRef.focusedPieceIndex, "left");
                    thisRef.draw();
                    break;

                case 39: // right
                    thisRef.adjustPiece(thisRef.focusedPieceIndex, "right");
                    thisRef.draw();
                    break;

                case 65: // a
                    thisRef.adjustPiece(thisRef.focusedPieceIndex, "rotleft");
                    thisRef.draw();
                    break;

                case 32: // spacebar
                    thisRef.quickPush(thisRef.focusedPieceIndex, "down");
                    thisRef.draw();
                    break;
                    
                case 83: // s
                    thisRef.adjustPiece(thisRef.focusedPieceIndex, "rotright");
                    thisRef.draw();
                    break;
            }
        }
    }

    this.updateDisplay = function (_what, _value) {

        switch (_what) {

            case "pieces":

                break;

            case "lines":

                break;

            case "blocks":

                break;
        }
    }

    this.gameLoop = function () {

        console.log("game loop");

        thisRef.updateDisplay("pieces", thisRef.piecetot);

        thisRef.update();
        thisRef.draw();        
        
        if (thisRef.running)
            setTimeout(function () { thisRef.gameLoop(); }, thisRef.updateSpeed);
    }

    this.update = function () {

        if (thisRef.pieces[thisRef.focusedPieceIndex].dead == true) {

            thisRef.pieces.push(new Piece(thisRef.pieceArr[Math.floor(Math.random() * thisRef.pieceArr.length)], 7, 0, thisRef.blockSize));
            thisRef.focusedPieceIndex = (thisRef.pieces.length - 1);
            thisRef.piecetot++;
        }

        thisRef.adjustPiece(thisRef.focusedPieceIndex, "down");
    }

    this.draw = function () {

        thisRef.ctx.clearRect(0, 0, thisRef.mapWidth * thisRef.blockSize, thisRef.mapHeight * thisRef.blockSize);

        thisRef.map.update();
        thisRef.map.draw(thisRef.ctx);

        for (var i = 0; i < thisRef.pieces.length; i++)
            if (thisRef.pieces[i].dead == false)
                thisRef.pieces[i].draw(thisRef.ctx);
    }

    this.endGame = function() {
        	
        console.log("game over");

        thisRef.running = false;
	
        thisRef.map.drawPausedState(thisRef.ctx);
    }
    
    this.checkAndClear = function() {

        for (var i = 0; i < thisRef.map.height; i++) {

            if (thisRef.map.checkRow(i) == thisRef.map.width) {

                thisRef.lines++;
                this.map.clearRow(i);
            }
        }
	
        thisRef.updateDisplay("lines", thisRef.lines);
        thisRef.updateDisplay("blocks", thisRef.blocks);
    }
        
    this.checkDynamicPieces = function(_currentPiece) {
                
        for (var j = 0; j < thisRef.pieces.length; j++)
            if (thisRef.pieces[j].dead == false && j != _currentPiece)
                if (_currentPiece.checkForOverlap(thisRef.pieces[j]))
                    return true;
	
        return false;
    }
    
    // PIECE STUFF ////////////////////////////////////////////////////////////////////
    
    this.quickPush = function(_pieceNum, _dir) {

        var keepGoing = true;

        if (_dir == "down")
            while (keepGoing == true)
                keepGoing = thisRef.adjustPiece(thisRef.focusedPieceIndex, "down");
    }

    // BLOCK CONTROLLER ////////////////////////////////////////////////////////////////
   
    this.adjustPiece = function(_which, _func, _extra) {

        var collision = false;
	
        var preX = thisRef.pieces[_which].x;
        var preY = thisRef.pieces[_which].y;
        var rotated = "";
        var dropCollide = false;
	
        switch (_func) {

            case "down":
                thisRef.pieces[_which].y++;
                dropCollide = true;
                break;

            case "up":
                thisRef.pieces[_which].y--;
                break;

            case "left":
                thisRef.pieces[_which].x--;
                break;

            case "right":
                thisRef.pieces[_which].x++;
                break;

            case "rotright":
                thisRef.pieces[_which].rotate("right");
                rotated = "left";
                break;

            case "rotleft":
                thisRef.pieces[_which].rotate("left");
                rotated = "right";
                break;
        }
        
        // check if this move was legal, if not set it back.
        if (thisRef.pieces[_which].y < 0 ||
            (thisRef.pieces[_which].y + (thisRef.pieces[_which].height + 1)) > thisRef.map.height) {

            thisRef.collision = true;
            thisRef.pieces[_which].y = preY;
            
            if (dropCollide) {

                thisRef.map.flattenPiece(thisRef.pieces[_which]);
                thisRef.pieces[_which].dead = true;
                thisRef.checkAndClear();
                return false;
            }
        }
	
        if (thisRef.pieces[_which].x < 0 ||
            (thisRef.pieces[_which].x + (thisRef.pieces[_which].width + 1)) > thisRef.map.width) {

            collision = true;
            thisRef.pieces[_which].x = preX;
        }
	
        // check to make sure this piece doesnt sit anywhere other pieces do.
        if (thisRef.checkDynamicPieces(_which) == true) {

            collision = true;
            thisRef.pieces[_which].y = preY;
            thisRef.pieces[_which].x = preX;
            
            if (rotated != "") 
                thisRef.pieces[_which].rotate(rotated);

            if (dropCollide) {

                thisRef.map.flattenPiece(thisRef.pieces[_which]);

                if (thisRef.pieces[_which].y == 0)
                    thisRef.endGame();

                return false;
            }
        }
	
        // check that this piece isnt touching anything it isnt supposed to on the map
        if (thisRef.map.checkPieceAgainstMap(thisRef.pieces[_which]) == true) {

            collision = true;
            thisRef.pieces[_which].y = preY;
            thisRef.pieces[_which].x = preX;

            if (rotated != "")
                thisRef.pieces[_which].rotate(rotated);

            if (dropCollide) {

                thisRef.map.flattenPiece(thisRef.pieces[_which]);
                thisRef.pieces[_which].dead = true;

                if (thisRef.pieces[_which].y == 0)
                    thisRef.endGame();

                return false;
            }
        }
	
        if (collision == true)
            return false;
        else
            return true;
    }
    
    thisRef.setup(_divId, _junkProb, _junkHeight, _updateSpeed, _blockSize, _height, _width);
}