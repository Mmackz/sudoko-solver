import { getColumn, getRegion, getRow } from "../helpers";
import { splitToRows } from "../helpers";

function safeToPlace(board, row, col, val) {
   const puzzle = board.flat();
   return (
      solver.checkColPlacement(puzzle, row, col, val) &&
      solver.checkRowPlacement(puzzle, row, col, val) &&
      solver.checkRegionPlacement(puzzle, row, col, val)
   );
}

function solveSudoku(grid, row = 0, col = 0) {
   // return true if end of grid is reached.
   if (row == 8 && col == 9) {
      return true;
   }

   // if column overflowing, reset column to 0 and increment row
   if (col > 8) {
      row++;
      col = 0;
   }

   // if item is a pre-set value, move to next column
   if (grid[row][col] !== ".") {
      return solveSudoku(grid, row, col + 1);
   }

   // start checking if any numbers 1-9 can be placed
   for (let i = 1; i <= 9; i++) {
      // if item is safe to place, enter it into grid and start checking next row
      if (safeToPlace(grid, row, col, i)) {
         grid[row][col] = i;
         if (solveSudoku(grid, row, col + 1)) {
            return true;
         } else {
            // if number does not lead to solved board, replace with placeholders
            grid[row][col] = ".";
         }
      }
   }

   // if no number found, return false and continue checking from previous frame
   return false;
}

class SudokuSolver {
   validate(puzzleString) {
      // validates puzzle is 81 characters and only contains valid characters
      return /^[1-9\.]{81}$/.test(puzzleString);
   }

   checkRowPlacement(puzzleString, row, column, value) {
      // returns true if value can be placed in row, otherwise false
      const arr = getRow(puzzleString, row);
      arr.splice(column, 1);
      return !arr.some((val) => val == value);
   }

   checkColPlacement(puzzleString, row, column, value) {
      // returns true if value can be placed in column, otherwise false
      const arr = getColumn(puzzleString, column);
      arr.splice(row, 1);
      return !arr.some((val) => val == value);
   }

   checkRegionPlacement(puzzleString, row, column, value) {
      // returns true if value can be placed in region, otherwise false
      return !getRegion(puzzleString, row, column).some((val) => val == value);
   }

   solve(puzzleString) {
      const grid = splitToRows(puzzleString);
      const solved = solveSudoku(grid);
      return solved ? grid.flat().join("") : false;
   }
}

const solver = new SudokuSolver();

console.log(solver.solve(testPuzzle));

module.exports = SudokuSolver;
