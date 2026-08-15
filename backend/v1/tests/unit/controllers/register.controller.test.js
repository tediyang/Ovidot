require("dotenv").config();
const { expect } = require("chai");
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const { User } = require("../../../models/engine/database.js");
const blacklist = require("../../../middleware/tokenBlacklist.js");
const requestValidator = require("../../../utility/validators/requests.validator.js");
const registerController = require("../../../controllers/register.controller.js");
const userController = require("../../../controllers/user.controller.js");
const googleAuthService = require("../../../services/googleAuthService.js");
const tempDataService = require("../../../services/tempDataService.js");
const util = require("../../../utility/encryption/cryptography.js");
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

  it("should register a user when the signup request is valid", async () => {
    req.body = { email: "new@example.com", password: "Password123#" };
    sandbox.stub(requestValidator.Signup, "validate").returns({
      value: req.body,
      error: null,
    });
    const createUserStub = sandbox.stub(userController, "createUser").resolves({
      _id: "user-1",
    });

    await registerController.signup(req, res);

    expect(createUserStub.calledOnce).to.be.true;
    expect(res.statusCode).to.equal(201);
    expect(res.body).to.deep.equal({ message: "Registration Successful" });
  });

  it("should return tokens for an existing Google-authenticated user", async () => {
    req.body = { token: "google-token" };
    sandbox.stub(requestValidator.GoogleOauth, "validate").returns({
      value: req.body,
      error: null,
    });
    sandbox.stub(googleAuthService, "verifyToken").resolves({
      success: true,
      data: { email: "google@example.com" },
    });
    const existingUser = {
      _id: "user-1",
      email: "google@example.com",
      status: userStatus.active,
      loginAttempts: 1,
      jwtRefreshToken: "",
      save: sandbox.stub().resolvesThis(),
    };
    sandbox.stub(User, "findOne").resolves(existingUser);
    const createTokenStub = sandbox
      .stub(registerController, "createToken")
      .resolves({ accessToken: "access", refreshToken: "refresh" });

    await registerController.googleAuth(req, res);

    expect(createTokenStub.calledOnceWithExactly(existingUser)).to.be.true;
    expect(existingUser.loginAttempts).to.equal(0);
    expect(existingUser.jwtRefreshToken).to.equal("refresh");
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.deep.equal({
      message: "Authentication successful",
      tokens: { accessToken: "access", refreshToken: "refresh" },
    });
  });

  it("should complete registration for a Google user and create an account", async () => {
    req.body = {
      uuid: "session-id",
      phone: "08130001111",
      dob: "1995-01-01",
      google: true,
    };
    sandbox.stub(requestValidator.CompleteRegistration, "validate").returns({
      value: req.body,
      error: null,
    });
    sandbox.stub(tempDataService, "retrieveData").resolves({
      email: "google@example.com",
      fname: "Jane",
      lname: "Doe",
    });
    sandbox.stub(util, "encrypt").resolves("hashed-password");
    sandbox.stub(util, "generatePassword").returns("generated-password");
    const user = {
      _id: "new-user",
      save: sandbox.stub().resolvesThis(),
    };
    sandbox.stub(userController, "createUser").resolves(user);
    sandbox
      .stub(registerController, "createToken")
      .resolves({ accessToken: "access", refreshToken: "refresh" });
    const deleteDataStub = sandbox
      .stub(tempDataService, "deleteData")
      .resolves();

    await registerController.completeRegistration(req, res);

    expect(user.jwtRefreshToken).to.equal("refresh");
    expect(user.save.calledOnce).to.be.true;
    expect(deleteDataStub.calledOnce).to.be.true;
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.deep.equal({
      message: "Authentication successful",
      tokens: { accessToken: "access", refreshToken: "refresh" },
    });
  });

  it("should return 401 when refresh token is missing", async () => {
    await registerController.refreshToken(req, res);

    expect(res.statusCode).to.equal(401);
    expect(res.body).to.deep.equal({ message: "Requires a token" });
  });

  it("should generate an access token for a payload", async () => {
    const token = await registerController.createToken(
      { _id: "user-1", email: "user@example.com", status: userStatus.active },
      true,
    );

    expect(token).to.be.a("string");
    expect(token).to.not.be.empty;
  });
});
