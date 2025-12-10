import Cell from '../../model/cell.model';
import { CellType } from '../../enum/cell-type.enum';

describe('Cell Model', () => {
  describe('constructor', () => {
    it('should create a cell with correct coordinates and value', () => {
      const cell = new Cell(5, 10, CellType.EMPTY);
      
      expect(cell.x).toBe(5);
      expect(cell.y).toBe(10);
      expect(cell.value).toBe(CellType.EMPTY);
    });
  });

  describe('isBlocked', () => {
    it('should return true when cell is a wall', () => {
      const wallCell = new Cell(0, 0, CellType.WALL);
      
      expect(wallCell.isBlocked(false)).toBe(true);
      expect(wallCell.isBlocked(true)).toBe(true);
    });

    it('should return true when cell is breakable and breaker is false', () => {
      const breakableCell = new Cell(0, 0, CellType.BREAKABLE);
      
      expect(breakableCell.isBlocked(false)).toBe(true);
      expect(breakableCell.isBlocked(true)).toBe(false);
    });

    it('should return false when cell is empty', () => {
      const emptyCell = new Cell(0, 0, CellType.EMPTY);
      
      expect(emptyCell.isBlocked(false)).toBe(false);
      expect(emptyCell.isBlocked(true)).toBe(false);
    });

    it('should return false for passable cell types', () => {
      const passableCells = [
        CellType.START,
        CellType.GOAL,
        CellType.SOUTH,
        CellType.EAST,
        CellType.NORTH,
        CellType.WEST,
        CellType.BREAKER,
        CellType.INVERTER,
        CellType.TELEPORT,
      ];

      passableCells.forEach((cellType) => {
        const cell = new Cell(0, 0, cellType);
        expect(cell.isBlocked(false)).toBe(false);
      });
    });

    it('should block breakable cells when breaker state', () => {
      const breakableCell = new Cell(3, 4, CellType.BREAKABLE);
      
      expect(breakableCell.isBlocked(false)).toBe(true);
      expect(breakableCell.isBlocked(true)).toBe(false);
    });

  });
});
