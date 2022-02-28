"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

// TEMP test puzzles
import { puzzlesAndSolutions } from "../controllers/puzzle-strings";
const [testPuzzle, testSolution] = puzzlesAndSolutions[0];

function validateCoordinate(input) {
   return /^[a-f][1-9]$/.test(input);
}

function validateValue(input) {
   return /^[1-9]$/.test(input);
}

function convertCoordinates(input) {
   const [letter, number] = input.split("");
   return [letter.toUpperCase().charCodeAt(0) - 65, number - 1];
}
const c = convertCoordinates("i1");

module.exports = function (app) {
   const solver = new SudokuSolver();

   app.route("/api/check").post((req, res) => {});

   app.route("/api/solve").post((req, res) => {});
};
