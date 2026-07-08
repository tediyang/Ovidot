require("dotenv").config();
const { expect } = require("chai");
const sinon = require("sinon");
const requestValidator = require("../../../utility/validators/requests.validator.js");
const userPopulate = require("../../../utility/helpers/user.populate.js");
const cycleController = require("../../../controllers/cycle.controller.js");

describe("CYCLE CONTROLLER", () => {
  let sandbox;
  let req;
  let res;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      body: {},
      params: {},
      query: {},
      user: { id: "user-id" },
    };
    res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
      send(payload) {
        this.body = payload;
        return this;
      },
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return 404 when trying to create a cycle for a missing user", async () => {
    req.body = {
      period: 4,
      ovulation: "2024-07-10",
      startdate: "2024-07-01",
    };
    sandbox.stub(requestValidator.CreateCycle, "validate").returns({
      value: req.body,
      error: null,
    });
    sandbox.stub(userPopulate, "populateWithCycles").resolves(null);

    await cycleController.createCycle(req, res);

    expect(res.statusCode).to.equal(404);
    expect(res.body).to.deep.equal({ message: "User not found" });
  });

  it("should return 404 when a requested cycle does not belong to the user", async () => {
    req.params = { cycleId: "cycle-id" };
    sandbox
      .stub(userPopulate, "populateWithCyclesBy")
      .resolves({ _cycles: [] });

    await cycleController.fetchOneCycle(req, res);

    expect(res.statusCode).to.equal(404);
    expect(res.body).to.deep.equal({ message: "Cycle not found" });
  });
});
