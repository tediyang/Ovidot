require("dotenv").config();
const { expect } = require("chai");
const sinon = require("sinon");
const { User } = require("../../../models/engine/database.js");
const blacklist = require("../../../middleware/tokenBlacklist.js");
const requestValidator = require("../../../utility/validators/requests.validator.js");
const passwordController = require("../../../controllers/password.controller.js");

describe("PASSWORD CONTROLLER", () => {
  let sandbox;
  let req;
  let res;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      body: {},
      params: {},
      headers: {},
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

  it("should return 404 when the email is not found during password reset request", async () => {
    req.body = { email: "missing@example.com", front_url: "http://frontend" };
    sandbox.stub(requestValidator.ForgetPass, "validate").returns({
      value: req.body,
      error: null,
    });
    sandbox.stub(User, "findOne").resolves(null);

    await passwordController.forgotPass(req, res);

    expect(res.statusCode).to.equal(404);
    expect(res.body).to.deep.equal({
      message: "missing@example.com not found",
    });
  });

  it("should reject a reset token when it is blacklisted", async () => {
    req.params = { token: "expired-token" };
    sandbox.stub(blacklist, "isTokenBlacklisted").returns(true);

    await passwordController.VerifyResetPass(req, res);

    expect(res.statusCode).to.equal(401);
    expect(res.body).to.deep.equal({ message: "Invalid or expired token" });
  });

  it("should reject password reset when the token is invalid or expired", async () => {
    req.body = { token: "invalid-token", new_password: "NewPassword123#" };
    sandbox.stub(requestValidator.ResetPass, "validate").returns({
      value: req.body,
      error: null,
    });
    sandbox.stub(blacklist, "isTokenBlacklisted").returns(true);

    await passwordController.ResetPass(req, res);

    expect(res.statusCode).to.equal(401);
    expect(res.body).to.deep.equal({
      message: "Invalid request, expired token",
    });
  });
});
