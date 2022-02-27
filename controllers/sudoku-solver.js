class SudokuSolver {
   validate(puzzleString) {
      return /^[1-9\.]{81}$/.test(puzzleString);
   }

   checkRowPlacement(puzzleString, row, column, value) {}

   checkColPlacement(puzzleString, row, column, value) {}

   checkRegionPlacement(puzzleString, row, column, value) {}

   solve(puzzleString) {}
}

module.exports = SudokuSolver;
