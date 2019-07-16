var Tetris = function (_divId, _junkProb, _junkHeight, _updateSpeed, _blockSize, _height, _width) {

    var thisRef = this;

    this.blockSize = 0;
    this.lines = 0;
    this.blocks = 0;
    this.piecetot = 0;
    this.running = false;
    this.canvas = null;
    this.ctx = null;
    this.updateSpeed = 0;

    // MAP STUFF ///////////////////////////////////////////////////////////////////
    this.map = new Array();
    this.mapHeight = 0;
    this.mapWidth = 0;
    this.ggID = 0;

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
        thisRef.mapHeight = _height;
        thisRef.mapWidth = _width;
        thisRef.updateSpeed = _updateSpeed;

        // init map
        thisRef.createMap(16, 22);

        // draw map grid
        thisRef.drawGrid();

        // add junk
        thisRef.fillWithJunk(_junkProb, _junkHeight);

        // make first piece
        thisRef.currentBlock = thisRef.makePiece(thisRef.pieceArr[Math.floor(Math.random() * thisRef.pieceArr.length)], 8, 0);
        thisRef.adjustPiece("color", thisRef.colors[Math.floor(Math.random() * thisRef.colors.length)]);
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

        if (thisRef.pieces[thisRef.currentBlock].dead == false) {

            switch (e.which) {

                case 38:
                    thisRef.adjustPiece("rotright");
                    break;

                case 40:
                    thisRef.quickPush(thisRef.currentBlock, "down");
                    break;

                case 37:
                    thisRef.adjustPiece("left");
                    break;

                case 39:
                    thisRef.adjustPiece("right");
                    break;

                case 65:
                    thisRef.adjustPiece("rotleft");
                    break;

                case 83:
                    thisRef.quickPush(thisRef.currentBlock, "down");
                    break;

                case 68:
                    thisRef.adjustPiece("rotright");
                    break;
            }
        }
    }

    this.updateDisplay = function (_what, _value) {

        switch (_what) {

            case "peices":

                break;

            case "lines":

                break;

            case "blocks":

                break;
        }
    }

    this.gameLoop = function () {

        console.log("game loop");

        thisRef.updateDisplay("peices", thisRef.piecetot);

        if (thisRef.pieces[thisRef.currentBlock].dead == true) {

            thisRef.piecetot++;
            thisRef.currentBlock = thisRef.makePiece(thisRef.pieceArr[Math.floor(Math.random() * thisRef.pieceArr.length)], 8, 0);
            thisRef.adjustPiece("color", thisRef.colors[Math.floor(Math.random() * thisRef.colors.length)]);
        }
	
        thisRef.adjustPiece("down");

        // draw everything
        thisRef.ctx.clearRect(0, 0, thisRef.mapWidth * thisRef.blockSize, thisRef.mapHeight * thisRef.blockSize);

        thisRef.drawGrid();

        for (var i = 0; i < thisRef.pieces.length; i++)
            if (thisRef.pieces[i].dead == false)
                thisRef.drawPiece(i);
        
        for (var x = 0; x < thisRef.mapWidth; x++) {
            for (var y = 0; y < thisRef.mapHeight; y++) {

                if (thisRef.map[x][y] != 0) {

                    thisRef.ctx.beginPath();
                    thisRef.ctx.rect(x * thisRef.blockSize, y * thisRef.blockSize, thisRef.blockSize, thisRef.blockSize);
                    thisRef.ctx.fillStyle = 'yellow';
                    thisRef.ctx.fill();
                    thisRef.ctx.lineWidth = 1;
                    thisRef.ctx.strokeStyle = 'black';
                    thisRef.ctx.stroke();
                }
            }
        }

        if (thisRef.running)
            setTimeout(function () { thisRef.gameLoop(); }, thisRef.updateSpeed);
    }

    this.endGame = function() {
        	
        console.log("game over");

        thisRef.running = false;
	
        // change all blocks to black
        /*
        for (var i = 0; i < thisRef.mapWidth; i++)
            for (var j = 0; j < thisRef.mapHeight; j++)
                if (thisRef.map[i][j] > 0)
                    trans.changeColorFast(this["block" + thisRef.map[i][j] + "_mc"], 100, 100, 100, 100, 100, 100); !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    */
    }

    this.createMap = function(_width, _height) {

        // clear map array
        thisRef.map = thisRef.create2DArray(_width, _height);
	
        thisRef.map = new Array();

        // fill it with empty pieces
        for (var x = 0; x <= _width; x++) {

            thisRef.map.push(new Array());

            for (var y = 0; y <= _height; y++) {

                thisRef.map[x].push(0);
            }
        }

        thisRef.mapHeight = _height;
        thisRef.mapWidth = _width;
    }

    this.drawGrid = function() {

        for (var x = 0; x < thisRef.mapWidth; x++) {
            
            for (var y = 0; y < thisRef.mapHeight; y++) {
                
                thisRef.ctx.beginPath();
                thisRef.ctx.rect(x * thisRef.blockSize, y * thisRef.blockSize, thisRef.blockSize, thisRef.blockSize);
                thisRef.ctx.fillStyle = 'black';
                thisRef.ctx.fill();
                thisRef.ctx.lineWidth = 1;
                thisRef.ctx.strokeStyle = 'white';
                thisRef.ctx.stroke();
            }
        }
    }

    this.rowFilled = function(_rowNum) {

        var numFilled = 0;

        for (var i = 0; i <= thisRef.mapWidth; i++)
            if (thisRef.map[i][_rowNum] > 0)
                numFilled++;

        return numFilled;
    }

    this.checkAndClear = function() {

        for (var i = 0; i < thisRef.mapHeight; i++) {

            if (thisRef.rowFilled(i) == thisRef.mapWidth) {

                thisRef.lines++;
			
                for (var o = 0; o <= thisRef.mapWidth; o++) {

                    if (thisRef.map[o][i] > 0) {

                        thisRef.blocks++;
                        thisRef.map[o][i] = 0;
                    }
                }
			
                for (var k = i; k > 0; k--) {

                    for (var j = 0; j < thisRef.mapWidth; j++) {

                        thisRef.map[j][k] = thisRef.map[j][(k - 1)];
                        thisRef.map[j][(k - 1)] = 0;
                    }
                }
            }
        }
	
        thisRef.updateDisplay("lines", thisRef.lines);
        thisRef.updateDisplay("blocks", thisRef.blocks);
    }

    this.checkAgainstMap = function(_currentPiece) {
        
        for (var a = 0; a <= thisRef.pieces[_currentPiece].width; a++)
            for (var s = 0; s <= thisRef.pieces[_currentPiece].height; s++)
                if (thisRef.pieces[_currentPiece].piece[a][s] > 0)
                    if (thisRef.map[(thisRef.pieces[_currentPiece].x + a)][(thisRef.pieces[_currentPiece].y + s)] > 0)
                        return true;
	
        return false;
    }

    this.fillWithJunk = function(_perc, _rows) {

        for (var i = thisRef.mapHeight; i >= (thisRef.mapHeight - _rows) ; i--)
            for (var o = 0; o < thisRef.mapWidth; o++)
                if (Math.floor(Math.random() * 100) < _perc)
                    thisRef.map[o][i] = newBlock();
    }

    // PIECE STUFF ////////////////////////////////////////////////////////////////////
    this.pID = 0;
    this.pieces = new Array();

    this.newBlock = function() {

        thisRef.pID++;
        return thisRef.pID;
    }

    this.makePiece = function(_type, _theX, _theY) {

        var tmpheight = 0;
        var tmpwidth = 0;
        var tmppiece = thisRef.create2DArray(4, 4);
        var xOffset = 0;
        var yOffset = 0;
	
        switch (_type) {

            case "square":

                tmpheight = 1;
                tmpwidth = 1;
                tmppiece[0][0] = thisRef.newBlock();
                tmppiece[1][0] = thisRef.newBlock();
                tmppiece[0][1] = thisRef.newBlock();
                tmppiece[1][1] = thisRef.newBlock();
                xOffset = 99;
                yOffset = 99;
                break;

            case "rightz":

                tmpheight = 1;
                tmpwidth = 2;
                tmppiece[0][0] = thisRef.newBlock();
                tmppiece[1][0] = thisRef.newBlock();
                tmppiece[2][0] = 0;
                tmppiece[0][1] = 0;
                tmppiece[1][1] = thisRef.newBlock();
                tmppiece[2][1] = thisRef.newBlock();
                xOffset = 1;
                yOffset = 1;
                break;

            case "leftz":

                tmpheight = 1;
                tmpwidth = 2;
                tmppiece[0][0] = 0;
                tmppiece[1][0] = thisRef.newBlock();
                tmppiece[2][0] = thisRef.newBlock();
                tmppiece[0][1] = thisRef.newBlock();
                tmppiece[1][1] = thisRef.newBlock();
                tmppiece[2][1] = 0;
                xOffset = 1;
                yOffset = 1;
                break;

            case "triangle":

                tmpheight = 1;
                tmpwidth = 2;
                tmppiece[1][0] = thisRef.newBlock();
                tmppiece[0][1] = thisRef.newBlock();
                tmppiece[1][1] = thisRef.newBlock();
                tmppiece[2][1] = thisRef.newBlock();
                xOffset = 1;
                yOffset = 1;
                break;

            case "pipe":

                tmpheight = 3;
                tmpwidth = 0;
                tmppiece[0][0] = thisRef.newBlock();
                tmppiece[0][1] = thisRef.newBlock();
                tmppiece[0][2] = thisRef.newBlock();
                tmppiece[0][3] = thisRef.newBlock();
                xOffset = 0;
                yOffset = 3;
                break;

            case "leftl":

                tmpheight = 2;
                tmpwidth = 1;
                tmppiece[0][2] = thisRef.newBlock();
                tmppiece[1][0] = thisRef.newBlock();
                tmppiece[1][1] = thisRef.newBlock();
                tmppiece[1][2] = thisRef.newBlock();
                xOffset = 1;
                yOffset = 3;
                break;

            case "rightl":

                tmpheight = 2;
                tmpwidth = 1;
                tmppiece[0][0] = thisRef.newBlock();
                tmppiece[0][1] = thisRef.newBlock();
                tmppiece[0][2] = thisRef.newBlock();
                tmppiece[1][2] = thisRef.newBlock();
                xOffset = 0;
                yOffset = 3;
                break;
        }
        	
        thisRef.pieces.push({
            x: _theX,
            y: _theY,
            height: tmpheight,
            width: tmpwidth,
            piece: tmppiece,
            dead: false,
            xO: xOffset,
            yO: yOffset
        });
	
        // draw piece with all its blocks
        //thisRef.drawPiece(thisRef.pieces.length - 1);
	
        return thisRef.pieces.length - 1;
    }

    this.drawPiece = function(_pieceNum) {

        for (var i = 0; i <= thisRef.pieces[_pieceNum].width; i++) {

            for (var o = 0; o <= thisRef.pieces[_pieceNum].height; o++) {

                if (thisRef.pieces[_pieceNum].piece[i][o] > 0) {
                    
                    thisRef.ctx.beginPath();
                    thisRef.ctx.rect(((thisRef.pieces[_pieceNum].x * thisRef.blockSize) + (i * thisRef.blockSize)), ((thisRef.pieces[_pieceNum].y * thisRef.blockSize) + (o * thisRef.blockSize)), thisRef.blockSize, thisRef.blockSize);
                    thisRef.ctx.fillStyle = 'blue';
                    thisRef.ctx.fill();
                    thisRef.ctx.lineWidth = 2;
                    thisRef.ctx.strokeStyle = 'black';
                    thisRef.ctx.stroke();
                }
            }
        }
    }

    this.checkDynamicPieces = function(_currentPiece) {
        
        for (var a = 0; a <= thisRef.pieces[_currentPiece].width; a++)
            for (var s = 0; s <= thisRef.pieces[_currentPiece].height; s++)
                if (thisRef.pieces[_currentPiece].piece[a][s] > 0)
                    for (var j = 0; j < thisRef.pieces.length; j++)
                        if (thisRef.pieces[j].dead == false && j != _currentPiece)
                            for (var i = 0; i <= thisRef.pieces[j].width; i++)
                                for (var o = 0; o <= thisRef.pieces[j].height; o++)
                                    if (thisRef.pieces[j].piece[i][o] > 0)
                                        if ((thisRef.pieces[j].x + i) == (thisRef.pieces[_currentPiece].x + a) &&
                                            (thisRef.pieces[j].y + o) == (thisRef.pieces[_currentPiece].y + s))
                                             return true;
	
        return false;
    }

    // applies each block to map instead of it being a dynamic piece.
    this.flattenPiece = function(_pieceNum) {

        for (var i = 0; i <= thisRef.pieces[_pieceNum].width; i++)
            for (var o = 0; o <= thisRef.pieces[_pieceNum].height; o++)
                if (thisRef.pieces[_pieceNum].piece[i][o] > 0)
                    thisRef.map[(thisRef.pieces[_pieceNum].x + i)][(thisRef.pieces[_pieceNum].y + o)] = thisRef.pieces[_pieceNum].piece[i][o];
                
	
        thisRef.pieces[_pieceNum].dead = true;
        thisRef.checkAndClear();
    }

    this.rotatePiece = function(_pieceNum, _dir) {
        
        if (thisRef.pieces[_pieceNum].xO != 99 ||
            thisRef.pieces[_pieceNum].yO != 99) {

            // create temp copy of peice
            var brokenDownPiece = new Array();
            var oldPieceX = thisRef.pieces[_pieceNum].x;
            var oldPieceY = thisRef.pieces[_pieceNum].y;
            var originX = 0;
            var originY = 0;
            var graphicNum = 0;	
		
            for (var i = 0; i <= thisRef.pieces[_pieceNum].width; i++)
                for (var o = 0; o <= thisRef.pieces[_pieceNum].height; o++)
                    if (thisRef.pieces[_pieceNum].piece[i][o] > 0)
                        brokenDownPiece.push({ x: i, y: o, num: thisRef.pieces[_pieceNum].piece[i][o] });
			
            // translate pieces
            for (var index in brokenDownPiece) {

                var oldx = brokenDownPiece[index].x;
                var oldy = brokenDownPiece[index].y;
			
                brokenDownPiece[index].x -= thisRef.pieces[_pieceNum].xO;
                brokenDownPiece[index].y -= thisRef.pieces[_pieceNum].yO;
			
                if (brokenDownPiece[index].x == 0 && 
                    brokenDownPiece[index].y == 0) 
                    graphicNum = brokenDownPiece[index].num;
            }
		
            // rotate quadrants
            for (var index in brokenDownPiece) {

                var oldx = brokenDownPiece[index].x;
                var oldy = brokenDownPiece[index].y;
					
                if (_dir == "right") {

                    brokenDownPiece[index].x = (oldy); 
                    brokenDownPiece[index].y = (-oldx);
                } else {

                    brokenDownPiece[index].x = (-oldy); 
                    brokenDownPiece[index].y = (oldx);
                }
            }
		
            // retranslate the coordinates to upper left origin & get new width & height & the new origin
            var nWidth = 0;
            var nHeight = 0;
		
            var lowX = 0;
            var highX = 0;
            var lowY = 0;
            var highY = 0;
		
            for (var index in brokenDownPiece) {	
                
                if (brokenDownPiece[index].x < lowX)    { lowX = brokenDownPiece[index].x; }
                if (brokenDownPiece[index].x > highX)   { highX = brokenDownPiece[index].x; }
                if (brokenDownPiece[index].y < lowY)    { lowY = brokenDownPiece[index].y; }
                if (brokenDownPiece[index].y > highY)   { highY = brokenDownPiece[index].y; }
            }
		
            for (var index in brokenDownPiece) {

                var oldx = brokenDownPiece[index].x;
                var oldY = brokenDownPiece[index].y;
			
                brokenDownPiece[index].x -= lowX;
                brokenDownPiece[index].y -= lowY;
			
                if (brokenDownPiece[index].num == graphicNum) {

                    originX = brokenDownPiece[index].x;
                    originY = brokenDownPiece[index].y;
                }
            }
		
            //nWidth = (Math.abs(lowX) + highX);
            //nHeight = (Math.abs(lowY) + highY);
		
            nWidth = thisRef.pieces[_pieceNum].height
            nHeight = thisRef.pieces[_pieceNum].width
				
            // rebuild new temp piece
            var tmpPiece = thisRef.create2DArray(10, 10);
	
            for (var index in brokenDownPiece) 
                tmpPiece[brokenDownPiece[index].x][brokenDownPiece[index].y] = brokenDownPiece[index].num;
		
            // replace original piece with new temp piece
            thisRef.pieces[_pieceNum] = {
                                        x: oldPieceX,
                                        y: oldPieceY,
                                        height: nHeight,
                                        width: nWidth,
                                        piece: tmpPiece,
                                        dead: false,
                                        xO: originX,
                                        yO: originY,
                                        rotation: null
                                    };
        }
    }

    this.quickPush = function(_pieceNum, _dir) {

        var keepGoing = true;

        if (_dir == "down")
            while (keepGoing == true)
                keepGoing = thisRef.adjustPiece("down");
    }

    // BLOCK CONTROLLER ////////////////////////////////////////////////////////////////
    var currentBlock = 0;
    var myListener = new Object();
    
    this.adjustPiece = function(_func, _extra) {

        var collision = false;
	
        /*
        if (func == "color") {

            if (extra == "darkblue") 
            {
                for (var i:Number = 0; i<=pieces[_root.currentBlock].width; i++)
                {
                    for (var o:Number = 0; o<=pieces[_root.currentBlock].height; o++)
                    {
                        if (pieces[_root.currentBlock].piece[i][o]>0) {trans.changeColorFast(_root["block" + pieces[_root.currentBlock].piece[i][o] + "_mc"], 0, 0, 0, 0, 100, 0);}
                    }
                }
            }
		
            if (extra == "darkgreen") 
            {
                for (var i:Number = 0; i<=pieces[_root.currentBlock].width; i++)
                {
                    for (var o:Number = 0; o<=pieces[_root.currentBlock].height; o++)
                    {
                        if (pieces[_root.currentBlock].piece[i][o]>0) {trans.changeColorFast(_root["block" + pieces[_root.currentBlock].piece[i][o] + "_mc"], 0, 0, 100, 0, 0, 0);}
                    }
                }
            }
		
            if (extra == "darkred") 
            {
                for (var i:Number = 0; i<=pieces[_root.currentBlock].width; i++)
                {
                    for (var o:Number = 0; o<=pieces[_root.currentBlock].height; o++)
                    {
                        if (pieces[_root.currentBlock].piece[i][o]>0) {trans.changeColorFast(_root["block" + pieces[_root.currentBlock].piece[i][o] + "_mc"], 100, 0, 0, 0, 0, 0);}
                    }
                }
            }
		
            if (extra == "red") 
            {
                for (var i:Number = 0; i<=pieces[_root.currentBlock].width; i++)
                {
                    for (var o:Number = 0; o<=pieces[_root.currentBlock].height; o++)
                    {
                        if (pieces[_root.currentBlock].piece[i][o]>0) {trans.changeColorFast(_root["block" + pieces[_root.currentBlock].piece[i][o] + "_mc"], 100, 100, 0, 0, 0, 0);}
                    }
                }
            }
		
            if (extra == "green") 
            {
                for (var i:Number = 0; i<=pieces[_root.currentBlock].width; i++)
                {
                    for (var o:Number = 0; o<=pieces[_root.currentBlock].height; o++)
                    {
                        if (pieces[_root.currentBlock].piece[i][o]>0) {trans.changeColorFast(_root["block" + pieces[_root.currentBlock].piece[i][o] + "_mc"], 0, 0, 100, 100, 0, 0);}
                    }
                }
            }
		
            if (extra == "blue") 
            {
                for (var i:Number = 0; i<=pieces[_root.currentBlock].width; i++)
                {
                    for (var o:Number = 0; o<=pieces[_root.currentBlock].height; o++)
                    {
                        if (pieces[_root.currentBlock].piece[i][o]>0) {trans.changeColorFast(_root["block" + pieces[_root.currentBlock].piece[i][o] + "_mc"], 0, 0, 0, 0, 100, 100);}
                    }
                }
            }
            return true;
        }
        */
	
        var preX = thisRef.pieces[thisRef.currentBlock].x;
        var preY = thisRef.pieces[thisRef.currentBlock].y;
        var rotated = "";
        var dropCollide = false;
	
        switch (_func) {

            case "down":
                thisRef.pieces[thisRef.currentBlock].y++; dropCollide = true;
                break;

            case "up":
                thisRef.pieces[thisRef.currentBlock].y--;
                break;

            case "left":
                thisRef.pieces[thisRef.currentBlock].x--;
                break;

            case "right":
                thisRef.pieces[thisRef.currentBlock].x++;
                break;

            case "rotright":
                thisRef.rotatePiece(thisRef.currentBlock, "right"); rotated = "left";
                break;

            case "rotleft":
                thisRef.rotatePiece(thisRef.currentBlock, "left"); rotated = "right";
                break;
        }
        	
        // check if this move was legal, if not set it back.
        if (thisRef.pieces[thisRef.currentBlock].y < 0 ||
            (thisRef.pieces[thisRef.currentBlock].y + (thisRef.pieces[thisRef.currentBlock].height + 1)) > thisRef.mapHeight) {

            thisRef.collision = true;
            thisRef.pieces[thisRef.currentBlock].y = preY;
            
            if (dropCollide) {

                thisRef.flattenPiece(thisRef.currentBlock);
                return false;
            }
        }
	
        if (thisRef.pieces[thisRef.currentBlock].x < 0 ||
            (thisRef.pieces[thisRef.currentBlock].x + (thisRef.pieces[thisRef.currentBlock].width + 1)) > thisRef.mapWidth)
        {
            collision = true;
            thisRef.pieces[thisRef.currentBlock].x = preX;
        }
	
        // check to make sure this piece doesnt sit anywhere other pieces do.
        if (thisRef.checkDynamicPieces(thisRef.currentBlock) == true) {

            collision = true;
            thisRef.pieces[thisRef.currentBlock].y = preY;
            thisRef.pieces[thisRef.currentBlock].x = preX;
            
            if (rotated != "") 
                thisRef.rotatePiece(thisRef.currentBlock, rotated);

            if (dropCollide) {

                thisRef.flattenPiece(thisRef.currentBlock);

                if (thisRef.pieces[thisRef.currentBlock].y == 0)
                    thisRef.endGame();

                return false;
            }
        }
	
        // check that this piece isnt touching anything it isnt supposed to on the map
        if (thisRef.checkAgainstMap(thisRef.currentBlock) == true) {

            collision = true;
            thisRef.pieces[thisRef.currentBlock].y = preY;
            thisRef.pieces[thisRef.currentBlock].x = preX;

            if (rotated != "")
                thisRef.rotatePiece(thisRef.currentBlock, rotated);

            if (dropCollide) {

                thisRef.flattenPiece(thisRef.currentBlock);

                if (thisRef.pieces[thisRef.currentBlock].y == 0)
                    thisRef.endGame();

                return false;
            }
        }
	
        //thisRef.drawPiece(thisRef.currentBlock);

        if (collision == true)
            return false;
        else
            return true;
    }

    // UTILITY ////////////////////////////////////////////////////////////
    this.create2DArray = function(_width, _height) {

        var array = Array();
        
        for (var index = 0; index < _width; index++)
            array.push(Array(_height));
        
        return array;
    }

    thisRef.setup(_divId, _junkProb, _junkHeight, _updateSpeed, _blockSize, _height, _width);
}