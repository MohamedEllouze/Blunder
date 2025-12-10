import Blunder from "./Blunder";
import Grid from "./model/grid.model";

var inputs: string[] = readline().split(' ');
const L: number = parseInt(inputs[0]);
const C: number = parseInt(inputs[1]);
const rowGrid : string [] = []
for (let i = 0; i < L; i++) {
    const row: string = readline();
    rowGrid.push(row)
}

const grid = new Grid(rowGrid, L, C);
const blunder = new Blunder(grid);

while (true) {
    const canContinue = blunder.step();
    if (!canContinue) break;
    if (blunder.isOnGoal()) break;
}

if (blunder.loop) {
    console.log("LOOP");
} else {
    blunder.moves.forEach(m => console.log(m));
}