const GOL = require("./app/js/logic");

const gol = new GOL();
gol.initGrid();

test('grid rows number to equal 20', () => {
    expect(gol.getGrid().length).toBe(20);
});

test('the grid should be empty', () => {
    expect(gol.hasEnoughArea(0, 0, 5)).toBe(true);
    expect(gol.isEmptyCell(2, 2)).toBe(true);
});

test('the grid should be empty (area)', () => {
    gol.selectCell(3, 3, '#FF0000');
    expect(gol.hasEnoughArea(0, 0, 5)).toBe(false);
    expect(gol.isEmptyCell(2, 2)).toBe(true);
    expect(gol.isEmptyCell(3, 3)).toBe(false);
});

test('check neighbours of cells', () => {
   gol.initGrid();
   gol.selectCell(0, 0, '#FF0000');
   gol.selectCell(1, 0, '#FF0000');
   gol.selectCell(2, 0, '#FF0000');  
   gol.selectCell(1, 1, '#FF0000');
   gol.selectCell(1, 2, '#FF0000');
   
   expect(gol.getNeighbors(0, 0).length).toBe(2);
   expect(gol.getNeighbors(2, 1).length).toBe(4);
   expect(gol.getNeighbors(1, 1).length).toBe(4);
   expect(gol.getNeighbors(5, 5).length).toBe(0);
});

test('check pattern can be added', () => {
    gol.initGrid();
    var count = 0;
    gol.addPattern('boat', '#FF0000');
    for (var i = 0; i < gol.getRows(); i ++) {
        for (var j= 0; j < gol.getCols(); j ++) {
            if (!gol.isEmptyCell(i,j)) {
                count++;
            }
        }
    }
    expect(count).toBe(5);
});

// If the logic is correct, the vertical 4 blocks will eventually transform to a expected pattern
test('test grid tick update', () => {
    var color = '#FF0000';
    gol.initGrid();
    gol.selectCell(0, 1, color);    
    gol.selectCell(1, 1, color);
    gol.selectCell(2, 1, color);
    gol.selectCell(3, 1, color);
    gol.updateGrid();
    gol.updateGrid();
    expect(gol.isEmptyCell(2, 1)).toBe(true);
    expect(gol.isEmptyCell(1, 1)).toBe(true);
    expect(gol.isEmptyCell(2, 0)).toBe(false);
    expect(gol.isEmptyCell(1, 0)).toBe(false);
});