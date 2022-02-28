import { puzzlesAndSolutions } from "../controllers/puzzle-strings";
const [testPuzzle, testSolution] = puzzlesAndSolutions[0];

function splitToRows(string) {
   const arr = [];
   for (let i = 9; i <= 81; i += 9) {
      arr.push([...string.slice(i - 9, i)]);
   }
   return arr;
}

function getRegion(string, row, col) {
   const arr = [];
   const regionNum = Math.floor(row / 3) * 3 + Math.floor(col / 3);
   for (let i = 0; i < 81; i++) {
      if (i == row * 9 + col) continue;
      const regionRow = Math.floor(Math.floor(i / 9) / 3) * 3;
      if (Math.floor(i / 3) - 3 * Math.floor(i / 9) + regionRow === regionNum) {
         arr.push(testSolution[i])
      }
   }
   return arr;
}

function getRow(string, row) {
   return [...string.slice(row * 9, row * 9 + 9)];
}

function getColumn(string, col) {
   const arr = [];
   for (let i = col; i < 81; i += 9) {
      arr.push(string[i]);
   }
   return arr;
}

class SudokuSolver {
   validate(puzzleString) {
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

   checkRegionPlacement(puzzleString, row, column, value) {}

   solve(puzzleString) {}
}

const solver = new SudokuSolver();

console.log(solver.checkColPlacement(testPuzzle, 0, 0, 2));
// console.log(splitStringToRows(testPuzzle));
console.log(getRegion(testPuzzle, 0));

module.exports = SudokuSolver;



