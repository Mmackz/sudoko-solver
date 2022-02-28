"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");
import { convertCoordinates, validateValue, validateCoordinate } from "../helpers";

module.exports = function (app) {
   const solver = new SudokuSolver();

   app.route("/api/check").post((req, res) => {
      const { coordinate, puzzle, value } = req.body;

      // make sure required fields are in body
      if (!coordinate || !puzzle || !value) {
         res.json({ error: "Required field(s) missing" });
      }

      // check length of puzzle is the required 81 characters
      else if (puzzle.length != 81) {
         res.json({ error: "Expected puzzle to be 81 characters long" });
      }

      // check for invalid characters in puzzle
      else if (!solver.validate(puzzle)) {
         res.json({ error: "Invalid characters in puzzle" });
      }

      // validate value field
      else if (!validateValue(value)) {
         res.json({ error: "Invalid value" });
      }

      // validate coordinate
      else if (!validateCoordinate(coordinate)) {
         res.json({ error: "Invalid coordinate" });
      }

      // everything is validated, check if value can be placed.
      else {
         const [row, col] = convertCoordinates(coordinate);
         const conflicts = [];
         // check row, column and region for conflicts
         if (!solver.checkRowPlacement(puzzle, row, col, value)) {
            conflicts.push("row");
         }
         if (!solver.checkColPlacement(puzzle, row, col, value)) {
            conflicts.push("column");
         }
         if (!solver.checkRegionPlacement(puzzle, row, col, value)) {
            conflicts.push("region");
         }

         // value is valid only if no conflicts found
         const json = { valid: !conflicts.length };

         // if conflicts found, attach to returned json
         if (conflicts.length) {
            json.conflicts = conflicts;
         }
         res.json(json);
      }
   });

   app.route("/api/solve").post((req, res) => {});
};
