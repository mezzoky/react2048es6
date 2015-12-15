function rotateMatrixToLeft(matrix) {
    let numRows = matrix.length;
    let numCols = matrix[0].length;
    let neoMatrix = [];
    for (let x = 0; x < numRows; x++) {
        neoMatrix.push([]);
        for (let y = 0; y < numCols; y++) {
            neoMatrix[x][y] = matrix[y][numRows - 1 - x];
        }
    }
    return neoMatrix;
}

function range(num) {
    let arr = [];
    for (var i = 0; i < num; i++) {
        arr.push(i);
    }
    return arr;
}

class Tile {
    constructor(value=0, row=-1, col=-1) {
        this.id = Tile.id++;

        this.value = value;
        this.row = row;
        this.col = col;
        this.oldRow = -1;
        this.oldCol = -1;
        this.markForDeletion = false;
        this.mergedInto = null;
    }
    moveTo(row, col) {
        this.oldRow = this.row;
        this.oldCol = this.col;

        this.row = row;
        this.col = col;
        this.markForDeletion = false;
    }
    isNew() {
        return this.oldRow == -1 && !this.mergedInto;
    }
    hasMoved() {
        return (
            this.fromRow() != this.toRow() ||
            this.fromCol() != this.toCol()
        ) || this.mergedInto;
    }
    fromRow() {
        return this.mergedInto ? this.row : this.oldRow;
    }
    toRow() {
        return this.mergedInto ? this.mergedInto.row : this.row;
    }
    fromCol() {
        return this.mergedInto ? this.col : this.oldCol;
    }
    toCol() {
        return this.mergedInto ? this.mergedInto.col : this.col;
    }
}
Tile.id = 0;

class Board {
    constructor() {
        this.tiles = [];
        this.cells = [];
        for (let x in range(Board.size)) {
            this.cells[x] = [];
            for (let y in range(Board.size)) {
                this.cells[x][y] = this.addTile();
            }
        }
        this.addRandomTile();
        this.updatePositions();
    }
    addTile(...args) {
        let tile = new Tile(...args);
        this.tiles.push(tile);
        return tile;
    }
    addRandomTile() {
        let emptyCellsForRandomize = [];
        this.cells.forEach((row, x)=>{
            row.forEach((cell, y)=>{
                if (!cell.value) {
                    emptyCellsForRandomize.push({x: x, y: y});
                }
            });
        });
        let randomIndex = ~~(Math.random() * emptyCellsForRandomize.length);
        let cell = emptyCellsForRandomize[randomIndex];
        let newValue = Math.random() < Board.fourProbability ? 4 : 2;
        this.cells[cell.x][cell.y] = this.addTile(newValue);
    }
    moveLeft() {
        let hasChanged = false;
        for (let x in range(Board.size)) {
            let thisRow = this.cells[x].filter((cell)=>cell.value);
            for (let y in range(Board.size)) {
                let targetCell = thisRow.length ? thisRow.shift() : this.addTile();
                if (thisRow.length && thisRow[0].value === targetCell.value) {
                    let tempTargetCell = targetCell;
                    targetCell = this.addTile(targetCell.value);
                    tempTargetCell.mergedInto = targetCell;
                    let nextCell = thisRow.shift();
                    nextCell.mergedInto = targetCell;
                    targetCell.value += nextCell.value;
                }
                hasChanged |= (this.cells[x][y].value !== targetCell.value);
                this.cells[x][y] = targetCell;
            }
        }
        console.log(`hasChanged ${hasChanged}`);
        return hasChanged;
    }
    updatePositions() {
        this.cells.forEach((row, x)=>{
            row.forEach((cell, y)=>{cell.moveTo(x, y);});
        });
    }
    move(direction) {
        // 0 -> left, 1 -> up, 2 -> right, 3 -> down
        this.clearOldTiles();
        for (let i in range(direction)) {
            this.cells = rotateMatrixToLeft(this.cells);
        }
        let hasChanged = this.moveLeft();
        for (let i = direction; i < 4; i++) {
            this.cells = rotateMatrixToLeft(this.cells);
        }
        if (hasChanged) {
            this.addRandomTile();
        }
        this.updatePositions();
        return this;
    }
    clearOldTiles() {
        this.tiles = this.tiles.filter(tile=>tile.markForDeletion===false);
        /* those stay at outside and not found in this.cells will be removed next time */
        this.tiles.forEach(tile=>{tile.markForDeletion=true;});
    }
    hasWon() {}
    hasLost() {}
}
Board.size = 4;
Board.fourProbability = 0.1;
Board.deltaX = [-1, 0, 1, 0];
Board.deltaY = [0, -1, 0, 1];

export default Board;
