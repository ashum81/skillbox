var COLOR_EMPTY = "#FFFFFF";
var ROWS = 20;
var COLS = 30;

class GOL {
  constructor() {
    this.grid = [];
    this.nextGrid = [];
    this.rows = ROWS;
    this.cols = COLS;
    this.handler = null;
  }

  // Reset Grid to init state
  initGrid() {
    for (var row = 0; row < this.rows; row++) {
      this.grid[row] = [];
      for (var col = 0; col < this.cols; col++) {
        this.grid[row][col] = COLOR_EMPTY;
      }
    }
    return this.grid;
  }

  getGrid() {
    return this.grid;
  }

  setGrid(grid) {
    this.grid = grid;
    this.nextGrid = [];
  }

  // Update cells to compute the latest state
  updateGrid() {
    this.nextGrid = JSON.parse(JSON.stringify(this.grid));
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.cols; j++) {
        this.updateCell(i, j);
      }
    }
    this.grid = this.nextGrid;
    return this.grid;
  }

  getRows() {
    return this.rows;
  }
  getCols() {
    return this.cols;
  }

  // Update cell color by calculating neighbor score. Revive cells if needed
  updateCell(row, col) {
    var neighbors = this.getNeighbors(row, col);
    if (this.grid[row][col] !== COLOR_EMPTY) {
      if (neighbors.length < 2) {
        this.nextGrid[row][col] = COLOR_EMPTY;
      } else if (neighbors.length == 2 || neighbors.length == 3) {
        this.nextGrid[row][col] = this.grid[row][col];
      } else if (neighbors.length > 3) {
        this.nextGrid[row][col] = COLOR_EMPTY;
      }
    } else if (this.grid[row][col] == COLOR_EMPTY) {
      if (neighbors.length == 3) {
        this.nextGrid[row][col] = this.countAverageColor(neighbors);
      }
    }
  }

  // Calculate neighbour score
  getNeighbors(row, col) {
    var neighbors = [];
    if (row - 1 >= 0 && this.grid[row - 1][col] != COLOR_EMPTY) {
      neighbors.push(this.grid[row - 1][col]);
    }
    if (
      row - 1 >= 0 &&
      col - 1 >= 0 &&
      this.grid[row - 1][col - 1] != COLOR_EMPTY
    ) {
      neighbors.push(this.grid[row - 1][col - 1]);
    }
    if (
      row - 1 >= 0 &&
      col + 1 < this.cols &&
      this.grid[row - 1][col + 1] != COLOR_EMPTY
    ) {
      neighbors.push(this.grid[row - 1][col + 1]);
    }
    if (col - 1 >= 0 && this.grid[row][col - 1] != COLOR_EMPTY) {
      neighbors.push(this.grid[row][col - 1]);
    }
    if (col + 1 < this.cols && this.grid[row][col + 1] != COLOR_EMPTY) {
      neighbors.push(this.grid[row][col + 1]);
    }
    if (row + 1 < this.rows && this.grid[row + 1][col] != COLOR_EMPTY) {
      neighbors.push(this.grid[row + 1][col]);
    }
    if (
      row + 1 < this.rows &&
      col - 1 >= 0 &&
      this.grid[row + 1][col - 1] != COLOR_EMPTY
    ) {
      neighbors.push(this.grid[row + 1][col - 1]);
    }
    if (
      row + 1 < this.rows &&
      col + 1 < this.cols &&
      this.grid[row + 1][col + 1] != COLOR_EMPTY
    ) {
      neighbors.push(this.grid[row + 1][col + 1]);
    }
    return neighbors;
  }

  // Calculate average color by coverting hex value to decimal
  countAverageColor(neighbors) {
    var dec = 0;
    neighbors.forEach(n => {
      if (n) {
        dec += parseInt(n.slice(1), 16);
      }
    });
    return (
      "#" +
      Math.round(dec / neighbors.length)
        .toString(16)
        .toUpperCase()
    );
  }

  isEmptyCell(row, col) {
    return this.grid[row][col] == COLOR_EMPTY;
  }

  selectCell(row, col, color) {
    this.grid[row][col] = color;
  }

  // Add predefined pattern
  addPattern(pattern, color) {
    var size;
    var cells = [];
    switch (pattern) {
      case "boat":
        size = 4;
        cells = [
          { row: 1, col: 1 },
          { row: 1, col: 2 },
          { row: 2, col: 1 },
          { row: 2, col: 3 },
          { row: 3, col: 2 }
        ];
        break;
      case "blinker":
        size = 5;
        cells = [
          { row: 2, col: 1 },
          { row: 2, col: 2 },
          { row: 2, col: 3 }
        ];
        break;
      case "toad":
        size = 6;
        cells = [
          { row: 2, col: 2 },
          { row: 2, col: 3 },
          { row: 2, col: 4 },
          { row: 3, col: 1 },
          { row: 3, col: 2 },
          { row: 3, col: 3 }
        ];
        break;
      default:
        return;
    }
    var randomizedRowNums = [...Array(this.rows - size - 1).keys()].sort(
      () => Math.random() - 0.5
    );
    var randomizedColNums = [...Array(this.cols - size - 1).keys()].sort(
      () => Math.random() - 0.5
    );
    for (var i = 0; i < randomizedRowNums.length; i++) {
      for (var j = 0; j < randomizedColNums.length; j++) {
        var row = randomizedRowNums[i];
        var col = randomizedColNums[j];
        var empty = this.hasEnoughArea(row, col, size);
        if (empty) {
          for (var k = 0; k < cells.length; k++) {
            this.selectCell(row + cells[k].row, col + cells[k].col, color);
          }
          return;
        }
      }
    }
  }

  // Check if the cells are empty in the area
  hasEnoughArea(row, col, len) {
    var empty = true;
    for (var i = row; i < row + len && i < this.rows; i++) {
      for (var j = col; j < col + len && i < this.cols; j++) {
        if (this.grid[i][j] != COLOR_EMPTY) {
          empty = false;
          break;
        }
      }
    }
    return empty;
  }
}

// This file is shared by frontend and backend. For Node.js, it uses require to include the library
if (typeof module !== "undefined") {
  module.exports = GOL;
}
