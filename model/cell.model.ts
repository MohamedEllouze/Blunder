import { CellType } from "../enum/cell-type.enum";

class Cell {
    constructor(public x: number, public y: number, public value: CellType){}

    isBlocked = (breaker: boolean): boolean => {
        if (this.value === CellType.WALL) return true;
        if (this.value === CellType.BREAKABLE && !breaker) return true;

        return false;
    }
}

export default Cell;