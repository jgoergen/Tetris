var Map = function (_width, _height, _blockSize) {

    var thisRef = this;
    
    this.cells = null;
    this.height = 0;
    this.width = 0;
    this.blockSize = 0;

    this.setup = function (_width, _height, _blockSize) {

        thisRef.height = _height;
        thisRef.width = _width;
        thisRef.blockSize = _blockSize;

        thisRef.reset();
    }

    this.update = function () {

    }

    this.draw = function (_ctx) {

        // draw grid
        for (var x = 0; x < thisRef.width; x++) {
            for (var y = 0; y < thisRef.height; y++) {

                _ctx.beginPath();
                _ctx.rect(x * thisRef.blockSize, y * thisRef.blockSize, thisRef.blockSize, thisRef.blockSize);
                _ctx.fillStyle = 'black';
                _ctx.fill();
                _ctx.lineWidth = 1;
                _ctx.strokeStyle = 'white';
                _ctx.stroke();
            }
        }

        // draw blocks baked into map
        for (var x = 0; x < thisRef.width; x++) {
            for (var y = 0; y < thisRef.height; y++) {

                if (thisRef.cells[x][y] != null) {

                    _ctx.beginPath();
                    _ctx.rect(x * thisRef.blockSize, y * thisRef.blockSize, thisRef.blockSize, thisRef.blockSize);
                    _ctx.fillStyle = 'yellow';
                    _ctx.fill();
                    _ctx.lineWidth = 1;
                    _ctx.strokeStyle = 'black';
                    _ctx.stroke();
                }
            }
        }
    }

    this.drawPausedState = function (_ctx) {

        // draw grid
        for (var x = 0; x < thisRef.width; x++) {
            for (var y = 0; y < thisRef.height; y++) {

                _ctx.beginPath();
                _ctx.rect(x * thisRef.blockSize, y * thisRef.blockSize, thisRef.blockSize, thisRef.blockSize);
                _ctx.fillStyle = 'black';
                _ctx.fill();
                _ctx.lineWidth = 1;
                _ctx.strokeStyle = 'white';
                _ctx.stroke();
            }
        }

        // draw blocks baked into map
        for (var x = 0; x < thisRef.width; x++) {
            for (var y = 0; y < thisRef.height; y++) {

                if (thisRef.cells[x][y] != null) {

                    _ctx.beginPath();
                    _ctx.rect(x * thisRef.blockSize, y * thisRef.blockSize, thisRef.blockSize, thisRef.blockSize);
                    _ctx.fillStyle = 'grey';
                    _ctx.fill();
                    _ctx.lineWidth = 1;
                    _ctx.strokeStyle = 'black';
                    _ctx.stroke();
                }
            }
        }
    }

    this.checkRow = function (_rowNumber) {

        var numFilled = 0;

        for (var i = 0; i < thisRef.width; i++)
            if (thisRef.cells[i][_rowNumber] != null)
                numFilled++;

        return numFilled;
    }

    this.clearRow = function (_rowNumber) {
        
        // nudge every row above this down one.
        for (var y = _rowNumber; y > 2; y--) {
            for (var x = 0; x < thisRef.width; x++) {

                thisRef.cells[x][y] = thisRef.cells[x][(y - 1)];
                thisRef.cells[x][(y - 1)] = null;
            }
        }

        for (var x = 0; x < thisRef.width; x++)
            thisRef.cells[x][0] = null;
    }

    this.checkPieceAgainstMap = function (_piece) {

        for (var a = 0; a <= _piece.width; a++)
            for (var s = 0; s <= _piece.height; s++)
                if (_piece.blocks[a][s] != null)
                    if (thisRef.cells[(_piece.x + a)][(_piece.y + s)] != null)
                        return true;

        return false;
    }

    // applies each block to map instead of it being a dynamic piece.
    this.flattenPiece = function (_piece) {

        for (var x = 0; x <= _piece.width; x++)
            for (var y = 0; y <= _piece.height; y++)
                if (_piece.blocks[x][y] != null)
                    thisRef.cells[(_piece.x + x)][(_piece.y + y)] = _piece.blocks[x][y];
    }

    this.fillWithJunk = function (_perc, _rows) {

        for (var i = thisRef.height; i >= (thisRef.height - _rows) ; i--)
            for (var o = 0; o < thisRef.width; o++)
                if (Math.floor(Math.random() * 100) < _perc)
                    thisRef.cells[o][i] = new Block();
    }

    this.reset = function () {
        
        thisRef.cells = new Array();

        for (var x = 0; x < thisRef.width; x++) {

            thisRef.cells.push(new Array());
            for (var y = 0; y < thisRef.height; y++)
                thisRef.cells[x].push(null);
        }
    }
    
    thisRef.setup(_width, _height, _blockSize);
}