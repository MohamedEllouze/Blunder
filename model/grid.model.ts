import { CellType } from "../enum/cell-type.enum";
import { Direction } from "../enum/direction.enum";
import Cell from "./cell.model";

export default class Grid {
    readonly cells: Record<string, Cell> = {};
    readonly teleports: Cell[] = [];
    readonly startCell: Cell;

    constructor(rows: string[],rowCount: number, colCount : number) {
        if (rows.length === 0) {
            throw new Error("Grid cannot be created from an empty row list.");
        }


        for (let y = 0; y < rowCount; y++) {
            if (rows[y].length !== colCount) {
                throw new Error(
                    `Invalid row length at line ${y}: expected ${colCount}, received ${rows[y].length}`
                );
            }
        }

        let startCell: Cell | undefined;

        for (let y = 0; y < rowCount; y++) {
            for (let x = 0; x < colCount; x++) {
                const char = rows[y][x] as CellType;
                const cell = new Cell(x, y, char);

                this.cells[this.key(x, y)] = cell;

                if (cell.value === CellType.TELEPORT) {
                    this.teleports.push(cell);
                }

                if (cell.value === CellType.START) {
                    startCell = cell;
                }
            }
        }

        if (!startCell) {
            throw new Error("Start cell '@' not found on the grid.");
        }

        this.startCell = startCell;
    }

    private key(x: number, y: number): string {
        return `${x}_${y}`;
    }

    getCell(x: number, y: number): Cell | undefined {
        return this.cells[this.key(x, y)];
    }

    getNeighbors(cell: Cell): Record<Direction, Cell | undefined> {
        const { x, y } = cell;

        return {
            [Direction.WEST]:  this.getCell(x - 1, y),
            [Direction.EAST]:  this.getCell(x + 1, y),
            [Direction.NORTH]: this.getCell(x, y - 1),
            [Direction.SOUTH]: this.getCell(x, y + 1),
        };
    }
}
