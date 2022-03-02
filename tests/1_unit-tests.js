const chai = require("chai");
const { suite } = require("mocha");
const assert = chai.assert;

import { puzzlesAndSolutions } from "../controllers/puzzle-strings.js";

const testPuzzles = puzzlesAndSolutions.map((p) => p[0]);
const unsolvablePuzzle = testPuzzles.pop();
const invalidLenPuzzle = testPuzzles.pop();
const invalidCharsInPuzzle = testPuzzles.pop();

const Solver = require("../controllers/sudoku-solver.js");
const solver = new Solver();

suite("UnitTests", function () {
   suite("solver method tests", function () {
      suite(".validate() outputs", function () {
         test("valid puzzle string of 81 characters", function (done) {
            const [puzzle] = testPuzzles;
            assert.lengthOf(puzzle, 81, "puzzle length should be 81");
            testPuzzles.forEach((puzzle) => {
               assert.isTrue(
                  solver.validate(puzzle),
                  "puzzle with length of 81 should be true"
               );
            });
            done();
         });

         test("puzzle with invalid characters", function (done) {
            assert.isFalse(
               solver.validate(invalidCharsInPuzzle),
               "puzzle with invalid chars returns false"
            );
            done();
         });

         test("puzzle that is not 81 characters in length", function (done) {
            assert.isFalse(
               solver.validate(invalidLenPuzzle),
               "invalid length puzzle returns false"
            );
            done();
         });
      });

      suite(".checkRowPlacement() outputs", function () {
         test("valid row placement", function (done) {
            assert.isTrue(
               solver.checkRowPlacement(testPuzzles[0], 0, 1, 3),
               "row entry should be valid"
            );
            assert.isTrue(
               solver.checkRowPlacement(testPuzzles[1], 0, 1, 6),
               "row entry should be valid"
            );
            done();
         });

         test("invalid row placement", function (done) {
            assert.isFalse(
               solver.checkRowPlacement(testPuzzles[0], 0, 1, 2),
               "row entry should be invalid"
            );
            assert.isFalse(
               solver.checkRowPlacement(testPuzzles[1], 0, 1, 9),
               "row entry should be invalid"
            );
            done();
         });
      });

      suite(".checkColPlacement() outputs", function () {
         test("valid column placement", function (done) {
            assert.isTrue(
               solver.checkColPlacement(testPuzzles[0], 0, 1, 3),
               "column entry should be valid"
            );
            assert.isTrue(
               solver.checkColPlacement(testPuzzles[1], 0, 1, 6),
               "column entry should be valid"
            );
            done();
         });

         test("invalid column placement", function (done) {
            assert.isFalse(
               solver.checkColPlacement(testPuzzles[0], 0, 1, 2),
               "column entry should be invalid"
            );
            assert.isFalse(
               solver.checkColPlacement(testPuzzles[1], 0, 1, 9),
               "column entry should be invalid"
            );
            done();
         });
      });

      suite(".checkRegionPlacement() outputs", function () {
         test("valid region placement", function (done) {
            assert.isTrue(
               solver.checkRegionPlacement(testPuzzles[0], 0, 1, 3),
               "region entry should be valid"
            );
            assert.isTrue(
               solver.checkRegionPlacement(testPuzzles[1], 0, 1, 6),
               "region entry should be valid"
            );
            done();
         });

         test("invalid region placement", function (done) {
            assert.isFalse(
               solver.checkRegionPlacement(testPuzzles[0], 0, 1, 2),
               "region entry should be invalid"
            );
            assert.isFalse(
               solver.checkRegionPlacement(testPuzzles[1], 0, 1, 9),
               "region entry should be invalid"
            );
            done();
         });
      });

      suite(".solve() outputs", function () {
         test("valid puzzle passes solver", function (done) {
            assert.lengthOf(testPuzzles[0], 81, "puzzle length should be 81");
            testPuzzles.forEach((puzzle) => {
               assert.isOk(solver.solve(puzzle), "puzzle should be solvable");
               assert.lengthOf(
                  [...solver.solve(puzzle)].filter((char) => char !== "."),
                  81,
                  "solved puzzle should not contain any dots"
               );
            });
            done();
         });

         test("invalid puzzle fails solver", function (done) {
            assert.isFalse(solver.solve(unsolvablePuzzle), "puzzle should be unsolvable");
            done();
         });

         test("returns the expected solution for valid puzzles", function (done) {
            const [puzzle, solution] = puzzlesAndSolutions[0];
            assert.equal(
               solver.solve(puzzle),
               solution,
               "solved puzzle should match solution"
            );
            puzzlesAndSolutions.slice(0, 5).forEach((puzzle) => {
               assert.equal(
                  solver.solve(puzzle[0]),
                  puzzle[1],
                  "return and expected solution should match"
               );
            });
            done();
         });
      });
   });
});
