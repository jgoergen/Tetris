var Piece = function (_type, _x, _y, _blockSize) {

    var thisRef = this;

    this.x = 0;
    this.y = 0;
    this.height = 0;
    this.width = 0;
    this.blocks = null;
    this.dead = true;
    this.xO = 0;
    this.yO = 0;
    this.blockSize = 0;

    this.setup = function (_type, _theX, _theY, _blockSize) {

        this.blockSize = _blockSize;

        var tmpheight = 0;
        var tmpwidth = 0;        
        var xOffset = 0;
        var yOffset = 0;

        var tmpBlocks = new Array();

        for (var x = 0; x < 4; x++) {

            tmpBlocks.push(new Array());
            for (var y = 0; y < 4; y++)
                tmpBlocks[x].push(null);
        }

        switch (_type) {

            case "square":

                tmpheight = 1;
                tmpwidth = 1;
                tmpBlocks[0][0] = new Block();
                tmpBlocks[1][0] = new Block();
                tmpBlocks[0][1] = new Block();
                tmpBlocks[1][1] = new Block();
                xOffset = 99;
                yOffset = 99;
                break;

            case "rightz":

                tmpheight = 1;
                tmpwidth = 2;
                tmpBlocks[0][0] = new Block();
                tmpBlocks[1][0] = new Block();
                tmpBlocks[2][0] = null;
                tmpBlocks[0][1] = null;
                tmpBlocks[1][1] = new Block();
                tmpBlocks[2][1] = new Block();
                xOffset = 1;
                yOffset = 1;
                break;

            case "leftz":

                tmpheight = 1;
                tmpwidth = 2;
                tmpBlocks[0][0] = null;
                tmpBlocks[1][0] = new Block();
                tmpBlocks[2][0] = new Block();
                tmpBlocks[0][1] = new Block();
                tmpBlocks[1][1] = new Block();
                tmpBlocks[2][1] = null;
                xOffset = 1;
                yOffset = 1;
                break;

            case "triangle":

                tmpheight = 1;
                tmpwidth = 2;
                tmpBlocks[1][0] = new Block();
                tmpBlocks[0][1] = new Block();
                tmpBlocks[1][1] = new Block();
                tmpBlocks[2][1] = new Block();
                xOffset = 1;
                yOffset = 1;
                break;

            case "pipe":

                tmpheight = 3;
                tmpwidth = 0;
                tmpBlocks[0][0] = new Block();
                tmpBlocks[0][1] = new Block();
                tmpBlocks[0][2] = new Block();
                tmpBlocks[0][3] = new Block();
                xOffset = 0;
                yOffset = 3;
                break;

            case "leftl":

                tmpheight = 2;
                tmpwidth = 1;
                tmpBlocks[0][2] = new Block();
                tmpBlocks[1][0] = new Block();
                tmpBlocks[1][1] = new Block();
                tmpBlocks[1][2] = new Block();
                xOffset = 1;
                yOffset = 3;
                break;

            case "rightl":

                tmpheight = 2;
                tmpwidth = 1;
                tmpBlocks[0][0] = new Block();
                tmpBlocks[0][1] = new Block();
                tmpBlocks[0][2] = new Block();
                tmpBlocks[1][2] = new Block();
                xOffset = 0;
                yOffset = 3;
                break;
        }

        thisRef.x = _theX;
        thisRef.y = _theY;
        thisRef.height = tmpheight;
        thisRef.width = tmpwidth;
        thisRef.blocks = tmpBlocks;
        thisRef.dead = false;
        thisRef.xO = xOffset;
        thisRef.yO = yOffset;
    }

    this.update = function () {

    }

    this.draw = function (_ctx) {

        for (var x = 0; x <= thisRef.width; x++) {
            for (var y = 0; y <= thisRef.height; y++) {

                if (thisRef.blocks[x][y] != null) {

                    _ctx.beginPath();
                    _ctx.rect(((thisRef.x * thisRef.blockSize) + (x * thisRef.blockSize)),
                              ((thisRef.y * thisRef.blockSize) + (y * thisRef.blockSize)),
                              thisRef.blockSize,
                              thisRef.blockSize);
                    _ctx.fillStyle = 'blue';
                    _ctx.fill();
                    _ctx.lineWidth = 2;
                    _ctx.strokeStyle = 'black';
                    _ctx.stroke();
                }
            }
        }
    }

    this.checkForOverlap = function (_peice) {

        for (var a = 0; a <= thisRef.width; a++)
            for (var s = 0; s <= thisRef.height; s++)
                if (thisRef.blocks[a][s] != null)
                    for (var i = 0; i <= _peice.width; i++)
                        for (var o = 0; o <= _peice.height; o++)
                            if (_peice.blocks[i][o] != null)
                                if ((_peice.x + i) == (thisRef.x + a) &&
                                    (_peice.y + o) == (thisRef.y + s))
                                    return true;

        return false;
    }

    this.rotate = function (_dir) {

        if (thisRef.xO != 99 ||
            thisRef.yO != 99) {

            // create temp copy of peice
            var brokenDownPiece = new Array();
            var oldPieceX = thisRef.x;
            var oldPieceY = thisRef.y;
            var originX = 0;
            var originY = 0;
            var graphicNum = 0;

            for (var x = 0; x <= thisRef.width; x++)
                for (var y = 0; y <= thisRef.height; y++)
                    if (thisRef.blocks[x][y] != null)
                        brokenDownPiece.push({ x: x, y: y, num: thisRef.blocks[x][y] });

            // translate pieces
            for (var index in brokenDownPiece) {

                var oldx = brokenDownPiece[index].x;
                var oldy = brokenDownPiece[index].y;

                brokenDownPiece[index].x -= thisRef.xO;
                brokenDownPiece[index].y -= thisRef.yO;

                if (brokenDownPiece[index].x == 0 &&
                    brokenDownPiece[index].y == 0)
                    graphicNum = brokenDownPiece[index].num;
            }

            // rotate quadrants
            for (var index in brokenDownPiece) {

                var oldx = brokenDownPiece[index].x;
                var oldy = brokenDownPiece[index].y;

                if (_dir == "right") {

                    brokenDownPiece[index].x = oldy;
                    brokenDownPiece[index].y = -oldx;
                } else {

                    brokenDownPiece[index].x = -oldy;
                    brokenDownPiece[index].y = oldx;
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

                if (brokenDownPiece[index].x < lowX) { lowX = brokenDownPiece[index].x; }
                if (brokenDownPiece[index].x > highX) { highX = brokenDownPiece[index].x; }
                if (brokenDownPiece[index].y < lowY) { lowY = brokenDownPiece[index].y; }
                if (brokenDownPiece[index].y > highY) { highY = brokenDownPiece[index].y; }
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
            
            nWidth = thisRef.height;
            nHeight = thisRef.width;

            // rebuild new temp piece
            var tmpPiece = new Array();

            for (var x = 0; x < 10; x++) {

                tmpPiece.push(new Array());
                for (var y = 0; y < 10; y++)
                    tmpPiece[x].push(null);
            }

            for (var index in brokenDownPiece)
                tmpPiece[brokenDownPiece[index].x][brokenDownPiece[index].y] = brokenDownPiece[index].num;

            // replace original piece with new temp piece            
            thisRef.x = oldPieceX;
            thisRef.y = oldPieceY;
            thisRef.height = nHeight;
            thisRef.width = nWidth;
            thisRef.blocks = tmpPiece;
            thisRef.dead = false;
            thisRef.xO = originX;
            thisRef.yO = originY;
            thisRef.rotation = null;
        }
    }
    
    thisRef.setup(_type, _x, _y, _blockSize);
}