import Grid from '../../model/grid.model';
import { CellType } from '../../enum/cell-type.enum';
import { Direction } from '../../enum/direction.enum';

describe('Grid Model', () => {
  describe('constructor', () => {
    it('should create grid with valid input', () => {
      const rows = [
        '#####',
        '#@  #',
        '#   #',
        '#  $#',
        '#####',
      ];
      
      const grid = new Grid(rows, 5, 5);
      
      expect(grid.startCell).toBeDefined();
      expect(grid.startCell.x).toBe(1);
      expect(grid.startCell.y).toBe(1);
      expect(grid.startCell.value).toBe(CellType.START);
    });

    it('should throw error when start cell is missing', () => {
      const rows = [
        '#####',
        '#   #',
        '#   #',
        '#  $#',
        '#####',
      ];
      
      expect(() => new Grid(rows, 5, 5)).toThrow('Start cell \'@\' not found on the grid.');
    });

    it('should throw error when row length does not match colCount', () => {
      const rows = [
        '#####',
        '#@  ',
        '#   #',
        '#  $#',
        '#####',
      ];
      
      expect(() => new Grid(rows, 5, 5)).toThrow(/Invalid row length at line 1/);
    });

    it('should throw error when rows array is empty', () => {
      expect(() => new Grid([], 0, 5)).toThrow('Grid cannot be created from an empty row list.');
    });
  });

  describe('getCell', () => {
    let grid: Grid;

    beforeEach(() => {
      const rows = [
        '########',
        '# @    #',
        '#     X#',
        '# XXX  #',
        '#   XX #',
        '#   XX #',
        '#     $#',
        '########',
      ];
      grid = new Grid(rows, 8, 8);
    });

    it('should return start cell', () => {
      const cell = grid.getCell(2, 1);
      
      expect(cell).toBeDefined();
      expect(cell?.value).toBe(CellType.START);
    });

    it('should return undefined for out of bounds cell', () => {
      const cell = grid.getCell(10, 10);
      
      expect(cell).toBeUndefined();
    });

    it('should return wall cell', () => {
      const wallCell = grid.getCell(0, 1);
      
      expect(wallCell).toBeDefined();
      expect(wallCell?.value).toBe(CellType.WALL);
    });

    it('should return breakable cell', () => {
      const breakableCell = grid.getCell(6, 2);
      
      expect(breakableCell).toBeDefined();
      expect(breakableCell?.value).toBe(CellType.BREAKABLE);
    });
  });

  describe('getNeighbors', () => {
    let grid: Grid;

    beforeEach(() => {
      const rows = [
        '##########',
        '#        #',
        '#  S   W #',
        '#        #',
        '#  $     #',
        '#        #',
        '#@       #',
        '#        #',
        '#E     N #',
        '##########',
      ];
      grid = new Grid(rows, 10, 10);
    });

    it('should return neighbors in all four directions', () => {
      const cell = grid.getCell(1, 6)!;
      const neighbors = grid.getNeighbors(cell);

      expect(neighbors[Direction.NORTH]).toBeDefined();
      expect(neighbors[Direction.SOUTH]).toBeDefined();
      expect(neighbors[Direction.WEST]).toBeDefined();
      expect(neighbors[Direction.EAST]).toBeDefined();
    });

    it('should return undefined for neighbors outside grid bounds', () => {
      const cornerCell = grid.getCell(0, 0)!;
      const neighbors = grid.getNeighbors(cornerCell);

      expect(neighbors[Direction.NORTH]).toBeUndefined();
      expect(neighbors[Direction.WEST]).toBeUndefined();
      expect(neighbors[Direction.SOUTH]).toBeDefined();
      expect(neighbors[Direction.EAST]).toBeDefined();
    });

    it('should return direction cells as neighbors', () => {
      const cell = grid.getCell(3, 2)!;
      const neighbors = grid.getNeighbors(cell);

      expect(neighbors[Direction.NORTH]).toBeDefined();
      expect(neighbors[Direction.SOUTH]).toBeDefined();
      expect(neighbors[Direction.WEST]).toBeDefined();
      expect(neighbors[Direction.EAST]).toBeDefined();
    });
  });
});
