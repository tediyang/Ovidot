require("dotenv").config();
const { expect } = require("chai");
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const { User } = require("../../../models/engine/database.js");
const blacklist = require("../../../middleware/tokenBlacklist.js");
const requestValidator = require("../../../utility/validators/requests.validator.js");
const registerController = require("../../../controllers/register.controller.js");
const { userStatus } = require("../../../enums.js");

describe("REGISTER CONTROLLER", () => {
  let sandbox;
  let req;
  let res;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      body: {},
      params: {},
      header: sandbox.stub(),
      user: {},
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

  it("should return the welcome message from the home route", async () => {
    await registerController.home(req, res);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.deep.equal({
      message: "Welcome to Ovidot API - For help visit '/api/v1/documentation",
    });
  });

  it("should return 400 when the account is already deactivated during login", async () => {
    req.body = { email_or_phone: "user@example.com", password: "Password123#" };
    sandbox.stub(requestValidator.Login, "validate").returns({
      value: req.body,
      error: null,
    });
    sandbox.stub(User, "findOne").resolves({
      status: userStatus.deactivated,
      save: sandbox.stub().resolvesThis(),
    });

    await registerController.login(req, res);

    expect(res.statusCode).to.equal(400);
    expect(res.body)
      .to.have.property("message")
      .that.includes("Account deactivated");
  });

  it("should return the remaining attempts when the password is incorrect", async () => {
    req.body = {
      email_or_phone: "user@example.com",
      password: "WrongPass123#",
    };
    sandbox.stub(requestValidator.Login, "validate").returns({
      value: req.body,
      error: null,
    });

    const hashedPassword = await bcrypt.hash("CorrectPass123#", 10);
    const user = {
      status: userStatus.active,
      password: hashedPassword,
      loginAttempts: 2,
      save: sandbox.stub().resolvesThis(),
    };

    sandbox.stub(User, "findOne").resolves(user);

    await registerController.login(req, res);

    expect(res.statusCode).to.equal(400);
    expect(res.body).to.deep.equal({
      message: "password incorrect",
      remainingAttempts: 3,
    });
    expect(user.loginAttempts).to.equal(3);
    expect(user.save.calledOnce).to.be.true;
  });

  it("should clear the refresh token and blacklist the access token on logout", async () => {
    req.header.withArgs("Authorization").returns("Bearer access-token");
    req.user = { id: "user-id" };

    const user = {
      jwtRefreshToken: "refresh-token",
      save: sandbox.stub().resolvesThis(),
    };
    const blacklistStub = sandbox.stub(blacklist, "updateBlacklist");
    sandbox.stub(User, "findById").resolves(user);

    await registerController.logout(req, res);

    expect(blacklistStub.calledOnceWithExactly("access-token")).to.be.true;
    expect(user.jwtRefreshToken).to.equal("");
    expect(user.save.calledOnce).to.be.true;
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("message", "Logout Successful");
  });
});
