import { Direction } from '../enum/direction.enum';
import { CellType } from '../enum/cell-type.enum';
import Grid from '../model/grid.model';
import Blunder from '../Blunder';

export const deltas: Record<Direction, { dx: number; dy: number }> = {
  [Direction.NORTH]: { dx: 0, dy: -1 },
  [Direction.SOUTH]: { dx: 0, dy: 1 },
  [Direction.EAST]: { dx: 1, dy: 0 },
  [Direction.WEST]: { dx: -1, dy: 0 },
};

export function runBlunder(blunder: Blunder, maxSteps = 300) {
  let step = 0;
  while (blunder.step() && !blunder.isOnGoal() && step < maxSteps) {
    step++;
  }
}

export function replayMoves(
  grid: Grid,
  moves: Direction[],
  callback: (x: number, y: number, index: number) => void
) {
  let x = grid.startCell.x;
  let y = grid.startCell.y;

  moves.forEach((move, index) => {
    const { dx, dy } = deltas[move];
    x += dx;
    y += dy;
    callback(x, y, index);
  });
}

export function countCells(grid: Grid, type: CellType): number {
  let count = 0;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = grid.getCell(x, y);
      if (cell?.value === type) count++;
    }
  }
  return count;
}
