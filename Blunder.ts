import { CellType } from "./enum/cell-type.enum";
import { Direction } from "./enum/direction.enum";
import Cell from "./model/cell.model";
import Grid from "./model/grid.model";

const DIRECTION_PRIORITY: readonly Direction[] = [
    Direction.SOUTH,
    Direction.EAST,
    Direction.NORTH,
    Direction.WEST,
];

const CELL_DIRECTION_MAP: Partial<Record<CellType, Direction>> = {
    [CellType.SOUTH]: Direction.SOUTH,
    [CellType.EAST]: Direction.EAST,
    [CellType.NORTH]: Direction.NORTH,
    [CellType.WEST]: Direction.WEST,
};

export default class Blunder {
    private currentCell: Cell;
    private direction: Direction = Direction.SOUTH;
    private breaker = false;
    private reversed = false;

    private visited = new Set<string>();
    public loop = false;
    public moves: Direction[] = [];

    constructor(private readonly grid: Grid) {
        this.currentCell = grid.startCell;
    }

    private makeStateKey(): string {
        const mapSignature = Object.values(this.grid.cells)
            .map((cell) => cell.value)
            .join("");

        return [
            this.currentCell.x,
            this.currentCell.y,
            this.direction,
            this.breaker,
            this.reversed,
            mapSignature,
        ].join("|");
    }

    private applyCellEffects(): void {
        const value = this.currentCell.value;

        const forcedDirection = CELL_DIRECTION_MAP[value as CellType];
        if (forcedDirection) {
            this.direction = forcedDirection;
        }

        if (value === CellType.BREAKER) {
            this.breaker = !this.breaker;
        }

        if (value === CellType.INVERTER) {
            this.reversed = !this.reversed;
        }

        if (value === CellType.TELEPORT) {
            this.teleport();
        }
    }

    private teleport(): void {
        const [t1, t2] = this.grid.teleports;
        if (!t1 || !t2) return;

        if (this.currentCell === t1) {
            this.currentCell = t2;
        } else if (this.currentCell === t2) {
            this.currentCell = t1;
        }
    }

    private getDirectionPriority(): Direction[] {
        const base = [...DIRECTION_PRIORITY];
        return this.reversed ? base.reverse() : base;
    }

    private pickNextCell(): [Cell | null, Direction] {
        const neighbors = this.grid.getNeighbors(this.currentCell);

        let nextCell = neighbors[this.direction];
        let nextDirection = this.direction;

        if (!nextCell || nextCell.isBlocked(this.breaker)) {
            for (const dir of this.getDirectionPriority()) {
                const candidate = neighbors[dir];
                if (candidate && !candidate.isBlocked(this.breaker)) {
                    nextCell = candidate;
                    nextDirection = dir;
                    break;
                }
            }
        }

        if (!nextCell || nextCell.isBlocked(this.breaker)) {
            return [null, this.direction];
        }

        return [nextCell, nextDirection];
    }

    public step(): boolean {
        const stateKey = this.makeStateKey();
        if (this.visited.has(stateKey)) {
            this.loop = true;
            return false;
        }
        this.visited.add(stateKey);

        this.applyCellEffects();

        if (this.currentCell.value === CellType.GOAL) {
            return false;
        }

        const [nextCell, nextDirection] = this.pickNextCell();
        if (!nextCell) {
            this.loop = true;
            return false;
        }

        this.direction = nextDirection;
        this.currentCell = nextCell;

        if (this.currentCell.value === CellType.BREAKABLE && this.breaker) {
            this.currentCell.value = CellType.EMPTY;
        }

        this.moves.push(this.direction);

        return true;
    }

    public isOnGoal(): boolean {
        return this.currentCell.value === CellType.GOAL;
    }
}
