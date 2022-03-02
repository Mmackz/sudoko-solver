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

   suite("POST request to /api/check", function () {
      test("puzzle placement with all fields (no conflict)", function (done) {
         const [puzzle] = puzzlesAndSolutions[0];
         chai
            .request(server)
            .post("/api/check")
            .send({
               puzzle,
               coordinate: "A2",
               value: 3
            })
            .end(function (err, res) {
               expect(err).to.be.null;
               expect(res).to.have.status(200);
               assert.property(res.body, "valid", "body should have property named valid");
               assert.notProperty(
                  res.body,
                  "error",
                  "body should not have an error property"
               );
               assert.notProperty(
                  res.body,
                  "confict",
                  "body should not have conflict property"
               );
               assert.isBoolean(
                  res.body.valid,
                  "propety named valid should be of type boolean"
               );
               assert.isTrue(res.body.valid, "property named valid should be true");
               done();
            });
      });

      test("puzzle placement with single conflict", function (done) {
         const [puzzle] = puzzlesAndSolutions[0];
         chai
            .request(server)
            .post("/api/check")
            .send({
               puzzle,
               coordinate: "a1",
               value: 3
            })
            .end(function (err, res) {
               expect(err).to.be.null;
               expect(res).to.have.status(200);
               assert.property(res.body, "valid", "body should have property named valid");
               assert.notProperty(
                  res.body,
                  "error",
                  "body should not have an error property"
               );
               assert.property(res.body, "conflict", "body should have conflict property");
               assert.isBoolean(
                  res.body.valid,
                  "propety named valid should be of type boolean"
               );
               assert.isFalse(res.body.valid, "property named valid should be false");
               assert.isArray(res.body.conflict, "conflict property should be array");
               assert.lengthOf(
                  res.body.conflict,
                  1,
                  "conflict array should only contain one item"
               );
               assert.isTrue(
                  res.body.conflict.every((i) => i === "column"),
                  "only conflict should be column"
               );
               done();
            });
      });

      test("puzzle placement with two conflicts", function (done) {
         const [puzzle] = puzzlesAndSolutions[0];
         chai
            .request(server)
            .post("/api/check")
            .send({
               puzzle,
               coordinate: "a1",
               value: 4
            })
            .end(function (err, res) {
               expect(err).to.be.null;
               expect(res).to.have.status(200);
               assert.property(res.body, "valid", "body should have property named valid");
               assert.notProperty(
                  res.body,
                  "error",
                  "body should not have an error property"
               );
               assert.property(res.body, "conflict", "body should have conflict property");
               assert.isBoolean(
                  res.body.valid,
                  "propety named valid should be of type boolean"
               );
               assert.isFalse(res.body.valid, "property named valid should be false");
               assert.isArray(res.body.conflict, "conflict property should be array");
               assert.lengthOf(
                  res.body.conflict,
                  2,
                  "conflict array should only contain one item"
               );
               assert.deepEqual(
                  res.body.conflict,
                  ["row", "column"],
                  "row and column conflicts in conflict array"
               );
               done();
            });
      });

      test("puzzle placement with all placement conflicts", function (done) {
         const [puzzle] = puzzlesAndSolutions[0];
         chai
            .request(server)
            .post("/api/check")
            .send({
               puzzle,
               coordinate: "a1",
               value: 2
            })
            .end(function (err, res) {
               expect(err).to.be.null;
               expect(res).to.have.status(200);
               assert.property(res.body, "valid", "body should have property named valid");
               assert.notProperty(
                  res.body,
                  "error",
                  "body should not have an error property"
               );
               assert.property(res.body, "conflict", "body should have conflict property");
               assert.isBoolean(
                  res.body.valid,
                  "propety named valid should be of type boolean"
               );
               assert.isFalse(res.body.valid, "property named valid should be false");
               assert.isArray(res.body.conflict, "conflict property should be array");
               assert.lengthOf(
                  res.body.conflict,
                  3,
                  "conflict array should only contain one item"
               );
               assert.deepEqual(
                  res.body.conflict,
                  ["row", "column", "region"],
                  "all conflicts in conflict array"
               );
               done();
            });
      });

      test("puzzle placement with missing required fields", function (done) {
         const [puzzle] = puzzlesAndSolutions[0];
         chai
            .request(server)
            .post("/api/check")
            .send({
               puzzle,
               coordinate: "a1"
            })
            .end(function (err, res) {
               expect(err).to.be.null;
               expect(res).to.have.status(200);
               assert.property(res.body, "error");
               assert.notExists(res.body.valid, "valid propety should not exist");
               assert.equal(res.body.error, "Required field(s) missing");
               done();
            });
      });

      test("puzzle placement with invalid characters", function (done) {
         const [puzzle] = puzzlesAndSolutions[5];
         chai
            .request(server)
            .post("/api/check")
            .send({
               puzzle,
               coordinate: "a1",
               value: 3
            })
            .end(function (err, res) {
               expect(err).to.be.null;
               expect(res).to.have.status(200);
               assert.property(res.body, "error");
               assert.notExists(res.body.valid, "valid propety should not exist");
               assert.equal(res.body.error, "Invalid characters in puzzle");
               done();
            });
      });

      test("puzzle placement with incorrect length", function (done) {
         const [puzzle] = puzzlesAndSolutions[6];
         chai
            .request(server)
            .post("/api/check")
            .send({
               puzzle,
               coordinate: "a1",
               value: 3
            })
            .end(function (err, res) {
               expect(err).to.be.null;
               expect(res).to.have.status(200);
               assert.property(res.body, "error");
               assert.notExists(res.body.valid, "valid propety should not exist");
               assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
               done();
            });
      });

      test("puzzle placement with invalid placement coordinate", function (done) {
         const [puzzle] = puzzlesAndSolutions[1];
         chai
            .request(server)
            .post("/api/check")
            .send({
               puzzle,
               coordinate: "j1",
               value: 3
            })
            .end(function (err, res) {
               expect(err).to.be.null;
               expect(res).to.have.status(200);
               assert.property(res.body, "error");
               assert.notExists(res.body.valid, "valid propety should not exist");
               assert.equal(res.body.error, "Invalid coordinate");
               done();
            });
      });

      test("puzzle placement with invalid placement value", function (done) {
         const [puzzle] = puzzlesAndSolutions[1];
         chai
            .request(server)
            .post("/api/check")
            .send({
               puzzle,
               coordinate: "a1",
               value: 10
            })
            .end(function (err, res) {
               expect(err).to.be.null;
               expect(res).to.have.status(200);
               assert.property(res.body, "error");
               assert.notExists(res.body.valid, "valid propety should not exist");
               assert.equal(res.body.error, "Invalid value");
               done();
            });
      });
   });
});
