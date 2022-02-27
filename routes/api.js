'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

// TEMP test puzzles
import { puzzlesAndSolutions } from "../controllers/puzzle-strings"
const [testPuzzle, testSolution] = puzzlesAndSolutions[0];

module.exports = function (app) {
  
  const solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

    });
    
  app.route('/api/solve')
    .post((req, res) => {

    });
};
