import Blunder from '../Blunder';
import Grid from '../model/grid.model';
import { Direction } from '../enum/direction.enum';
import { CellType } from '../enum/cell-type.enum';
import { runBlunder, replayMoves, countCells } from './testUtils';

describe('Blunder Agent', () => {
    it('Simple moves : should move in basic directions without obstacles', () => {
      const rows = [
        '#####',
        '#@  #',
        '#   #',
        '#  $#',
        '#####',
      ];
      const grid = new Grid(rows, 5, 5);
      const blunder = new Blunder(grid);

      runBlunder(blunder, 300);

      expect(blunder.isOnGoal()).toBe(true);
    });

    it('Obstacles : should navigate around obstacles', () => {
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
      const grid = new Grid(rows, 8, 8);
      const blunder = new Blunder(grid);

      runBlunder(blunder, 300);

      expect(blunder.isOnGoal()).toBe(true);
    });

    it('Priorities : should follow direction priority [SOUTH, EAST, NORTH, WEST]', () => {
      const rows = [
        '########',
        '#     $#',
        '#      #',
        '#      #',
        '#  @   #',
        '#      #',
        '#      #',
        '########',
      ];
      const grid = new Grid(rows, 8, 8);
      const blunder = new Blunder(grid);

      runBlunder(blunder, 300);

      expect(blunder.isOnGoal()).toBe(true);
      expect(blunder.moves[0]).toBe(Direction.SOUTH);
    });

    it('Straight line : should move straight down', () => {
      const rows = [
        '########',
        '#      #',
        '# @    #',
        '# XX   #',
        '#  XX  #',
        '#   XX #',
        '#     $#',
        '########',
      ];
      const grid = new Grid(rows, 8, 8);
      const blunder = new Blunder(grid);

      runBlunder(blunder, 300);

      expect(blunder.isOnGoal()).toBe(true);
    });

    it('Path modifier : should change direction when stepping on direction cell', () => {
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

        const grid = new Grid(rows, 10, 10);
        const blunder = new Blunder(grid);

        runBlunder(blunder, 300);

        expect(blunder.isOnGoal()).toBe(true);

        const charGrid = rows.map(r => r.split(''));

        let steppedOnDirectionCell = false;

        replayMoves(grid, blunder.moves, (x, y, index) => {
            const cellChar = charGrid[y][x];

            const nextMove = blunder.moves[index + 1];
            if (!nextMove) return;

            switch (cellChar) {
                case 'S':
                    steppedOnDirectionCell = true;
                    expect(nextMove).toBe(Direction.SOUTH);
                    break;
                case 'N':
                    steppedOnDirectionCell = true;
                    expect(nextMove).toBe(Direction.NORTH);
                    break;
                case 'E':
                    steppedOnDirectionCell = true;
                    expect(nextMove).toBe(Direction.EAST);
                    break;
                case 'W':
                    steppedOnDirectionCell = true;
                    expect(nextMove).toBe(Direction.WEST);
                    break;
            }
        });

        expect(steppedOnDirectionCell).toBe(true);
    }); 

    it('Breaker mode : should destroy breakables when breaker is active', () => {
        const rows = [
            '##########',
            '# @      #',
            '# B      #',
            '#XXX     #',
            '# B      #',
            '#    BXX$#',
            '#XXXXXXXX#',
            '#        #',
            '#        #',
            '##########',
        ];

        const grid = new Grid(rows, 10, 10);
        const blunder = new Blunder(grid);

        const initialBreakables = countCells(grid, CellType.BREAKABLE);

        runBlunder(blunder, 300);

        const remainingBreakables = countCells(grid, CellType.BREAKABLE);
        expect(blunder.isOnGoal()).toBe(true);

        expect(remainingBreakables).toBeLessThan(initialBreakables);
    });

    it('Inverter : should reverse direction priority when stepping on inverter', () => {
        const rows = [
            '##########',
            '#    I   #',
            '#        #',
            '#       $#',
            '#       @#',
            '#        #',
            '#       I#',
            '#        #',
            '#        #',
            '##########',
        ];

        const grid = new Grid(rows, 10, 10);
        const blunder = new Blunder(grid);

        runBlunder(blunder, 300);

        expect(blunder.isOnGoal()).toBe(true);

        let steppedOnInverter = false;

        replayMoves(grid, blunder.moves, (x, y) => {
            const cell = grid.getCell(x, y);
            if (cell?.value === CellType.INVERTER) {
            steppedOnInverter = true;
            }
        });

        expect(steppedOnInverter).toBe(true);
    });

   it('Teleporter : should teleport to the other teleporter', () => {
    const rows = [
        '##########',
        '#    T   #',
        '#        #',
        '#        #',
        '#        #',
        '#@       #',
        '#        #',
        '#        #',
        '#    T  $#',
        '##########',
    ];

    const grid = new Grid(rows, 10, 10);
    const blunder = new Blunder(grid);

    runBlunder(blunder);

    let steppedOnTeleporter = false;

    replayMoves(grid, blunder.moves, (x, y) => {
        const cell = grid.getCell(x, y);
        if (cell?.value === CellType.TELEPORT) {
            steppedOnTeleporter = true;
        }
    });

    expect(steppedOnTeleporter).toBe(true);
    expect(blunder.isOnGoal()).toBe(true);
    });

   it('Broken wall : should not pass breakable without breaker, but pass with breaker', () => {
        const rows = [
            '##########',
            '#        #',
            '#  @     #',
            '#  B     #',
            '#  S   W #',
            '# XXX    #',
            '#  B   N #',
            '# XXXXXXX#',
            '#       $#',
            '##########',
        ];

        const rowsWithoutBreaker = rows.map(r => r.replace(/B/g, ' '));
        const gridNoBreaker = new Grid(rowsWithoutBreaker, 10, 10);
        const blunderNoBreaker = new Blunder(gridNoBreaker);

        runBlunder(blunderNoBreaker, 300);

        expect(blunderNoBreaker.isOnGoal()).toBe(false);

        const grid = new Grid(rows, 10, 10);
        const blunder = new Blunder(grid);

        const initialBreakables = countCells(grid, CellType.BREAKABLE);

        runBlunder(blunder, 300);

        const remainingBreakables = countCells(grid, CellType.BREAKABLE);
        expect(blunder.isOnGoal()).toBe(true);
        expect(remainingBreakables).toBeLessThan(initialBreakables);
    });

    it('All together : should handle map with all mechanics combined', () => {
      const rows = [
        '###############',
        '#      IXXXXX #',
        '#  @          #',
        '#             #',
        '#             #',
        '#  I          #',
        '#  B          #',
        '#  B   S     W#',
        '#  B   T      #',
        '#             #',
        '#         T   #',
        '#         B   #',
        '#            $#',
        '#        XXXX #',
        '###############',
      ];
      const grid = new Grid(rows, 15, 15);
      const blunder = new Blunder(grid);

      runBlunder(blunder, 500);

      expect(blunder.isOnGoal() || blunder.loop).toBe(true);
    });

    it('LOOP detection : should detect infinite loop', () => {
      const rows = [
        '###############',
        '#      IXXXXX #',
        '#  @          #',
        '#E S          #',
        '#             #',
        '#  I          #',
        '#  B          #',
        '#  B   S     W#',
        '#  B   T      #',
        '#             #',
        '#         T   #',
        '#         B   #',
        '#N          W$#',
        '#        XXXX #',
        '###############',
      ];
      const grid = new Grid(rows, 15, 15);
      const blunder = new Blunder(grid);
      
      runBlunder(blunder, 1000);

      expect(blunder.loop).toBe(true);
    });

    it('Multiple loops : should detect loop with multiple possible paths', () => {
      const rows = [
        '###############',
        '#  #@#I  T$#  #',
        '#  #    IB #  #',
        '#  #     W #  #',
        '#  #      ##  #',
        '#  #B XBN# #  #',
        '#  ##      #  #',
        '#  #       #  #',
        '#  #     W #  #',
        '#  #      ##  #',
        '#  #B XBN# #  #',
        '#  ##      #  #',
        '#  #       #  #',
        '#  #     W #  #',
        '#  #      ##  #',
        '#  #B XBN# #  #',
        '#  ##      #  #',
        '#  #       #  #',
        '#  #       #  #',
        '#  #      ##  #',
        '#  #  XBIT #  #',
        '#  #########  #',
        '#             #',
        '# ##### ##### #',
        '# #     #     #',
        '# #     #  ## #',
        '# #     #   # #',
        '# ##### ##### #',
        '#             #',
        '###############',
      ];
      const grid = new Grid(rows, 30, 15);
      const blunder = new Blunder(grid);
      
      runBlunder(blunder, 2000);

      expect(blunder.isOnGoal() || blunder.loop).toBe(true);
    });
});
