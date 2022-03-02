const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const expect = chai.expect;
const server = require("../server");

import { puzzlesAndSolutions } from "../controllers/puzzle-strings";

chai.use(chaiHttp);

suite("Functional Tests", function () {
   suite("POST request to /api/solve", function () {
      test("puzzle with valid puzzle string", function (done) {
         const [puzzle, solution] = puzzlesAndSolutions[0];
         chai
            .request(server)
            .post("/api/solve")
            .send({ puzzle })
            .end(function (err, res) {
               expect(err).to.be.null;
               expect(res).to.have.status(200);
               assert.property(res.body, "solution", "body has solution property");
               assert.equal(
                  res.body.solution,
                  solution,
                  "returned solution should match known solution"
               );
               expect(res.body.solution).to.have.lengthOf(
                  81,
                  "Solution should be exactly 81 characters"
               );
               done();
            });
      });

      test("puzzle with missing puzzle string", function (done) {
         chai
            .request(server)
            .post("/api/solve")
            .end(function (err, res) {
               expect(err).to.be.null;
               expect(res).to.have.status(200);
               assert.notProperty(
                  res.body,
                  "solution",
                  "body should not have solution property"
               );
               assert.property(res.body, "error", "body should have error property");
               assert.equal(
                  res.body.error,
                  "Required field missing",
                  "error message should be shown"
               );
               done();
            });
      });

      test("puzzle with invalid characters", function (done) {
         const [puzzle] = puzzlesAndSolutions[5];
         chai
            .request(server)
            .post("/api/solve")
            .send({ puzzle })
            .end(function (err, res) {
               expect(err).to.be.null;
               expect(res).to.have.status(200);
               assert.notProperty(
                  res.body,
                  "solution",
                  "body should not have solution property"
               );
               assert.property(res.body, "error", "body should have error property");
               assert.equal(
                  res.body.error,
                  "Invalid characters in puzzle",
                  "error message should be shown"
               );
               done();
            });
      });

      test("puzzle with incorrect length", function (done) {
         const [puzzle] = puzzlesAndSolutions[6];
         chai
            .request(server)
            .post("/api/solve")
            .send({ puzzle })
            .end(function (err, res) {
               expect(err).to.be.null;
               expect(res).to.have.status(200);
               assert.notProperty(
                  res.body,
                  "solution",
                  "body should not have solution property"
               );
               assert.property(res.body, "error", "body should have error property");
               assert.equal(
                  res.body.error,
                  "Expected puzzle to be 81 characters long",
                  "error message should be shown"
               );
               done();
            });
      });

      test("puzzle that cannot be solved", function (done) {
         const [puzzle] = puzzlesAndSolutions.at(-1);
         chai
            .request(server)
            .post("/api/solve")
            .send({ puzzle })
            .end(function (err, res) {
               expect(err).to.be.null;
               expect(res).to.have.status(200);
               assert.notProperty(
                  res.body,
                  "solution",
                  "body should not have solution property"
               );
               assert.property(res.body, "error", "body should have error property");
               assert.equal(
                  res.body.error,
                  "Puzzle cannot be solved",
                  "error message should be shown"
               );
               done();
            });
      });
   });
});
