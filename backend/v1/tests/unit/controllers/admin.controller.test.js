require("dotenv").config();
const { expect } = require("chai");
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const { Admin, User, Cycle } = require("../../../models/engine/database.js");
const blacklist = require("../../../middleware/tokenBlacklist.js");
const adminController = require("../../../admin/controller/admin.controller.js");
const userPopulate = require("../../../utility/helpers/user.populate.js");
const { Role, userStatus } = require("../../../enums.js");

describe("ADMIN CONTROLLER", () => {
  let sandbox;
  let req;
  let res;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    req = {
      body: {},
      params: {},
      query: {},
      user: {},
      header: sandbox.stub(),
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

  describe("logout", () => {
    it("should blacklist the token and return 200", async () => {
      req.header.withArgs("Authorization").returns("Bearer admin-token");
      req.user = { id: "admin-id", role: Role.super_admin };
      const blacklistStub = sandbox.stub(blacklist, "updateBlacklist");

      await adminController.logout(req, res);

      expect(blacklistStub.calledOnceWithExactly("admin-token")).to.be.true;
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property("message", "Logout Successful");
    });
  });

  describe("login", () => {
    it("should return 200 and token for valid admin credentials", async () => {
      const password = "SecureAdmin1#";
      const hashedPassword = await bcrypt.hash(password, 10);

      req.body = {
        email_or_username: "super@example.com",
        password,
      };

      const adminDocument = {
        _id: "admin-id",
        username: "super",
        email: "super@example.com",
        password: hashedPassword,
        status: userStatus.active,
        loginAttempts: 0,
        save: sandbox.stub().resolvesThis(),
      };

      const findOneStub = sandbox.stub(Admin, "findOne");
      findOneStub.onFirstCall().resolves(null);
      findOneStub.onSecondCall().resolves(adminDocument);
      const tokenStub = sandbox
        .stub(adminController, "createToken")
        .returns("jwt-token");

      await adminController.login(req, res);

      expect(tokenStub.calledOnceWithExactly(adminDocument)).to.be.true;
      expect(adminDocument.save.calledOnce).to.be.true;
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal({
        message: "Authentication successful",
        token: "jwt-token",
      });
    });

    it("should return 400 when credentials are invalid", async () => {
      req.body = {
        email_or_username: "missing@example.com",
        password: "bad-password",
      };

      sandbox.stub(Admin, "findOne").resolves(null);

      await adminController.login(req, res);

      expect(res.statusCode).to.equal(400);
      expect(res.body).to.have.property(
        "message",
        "email, username or password incorrect",
      );
    });

    it("should return 400 when the admin account is deactivated", async () => {
      const password = "SecureAdmin1#";
      req.body = {
        email_or_username: "super@example.com",
        password,
      };

      const adminDocument = {
        _id: "admin-id",
        username: "super",
        email: "super@example.com",
        password: await bcrypt.hash(password, 10),
        status: userStatus.deactivated,
        loginAttempts: 0,
      };

      sandbox.stub(Admin, "findOne").resolves(adminDocument);

      await adminController.login(req, res);

      expect(res.statusCode).to.equal(400);
      expect(res.body).to.have.property(
        "message",
        "Account deactivated - Contact your super administrator",
      );
    });

    it("should deactivate an admin after repeated invalid login attempts", async () => {
      const password = "SecureAdmin1#";
      req.body = {
        email_or_username: "super@example.com",
        password: "wrong-password",
      };

      const adminDocument = {
        _id: "admin-id",
        username: "super",
        email: "super@example.com",
        password: await bcrypt.hash(password, 10),
        status: userStatus.active,
        loginAttempts: 3,
        save: sandbox.stub().resolvesThis(),
      };

      sandbox.stub(Admin, "findOne").resolves(adminDocument);

      await adminController.login(req, res);

      expect(adminDocument.status).to.equal(userStatus.deactivated);
      expect(adminDocument.save.calledOnce).to.be.true;
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.have.property(
        "message",
        "Account deactivated - Contact your super administrator",
      );
    });
  });

  describe("getUser", () => {
    it("should return 404 when the requested user does not exist", async () => {
      req.body = { email: "missing@example.com" };
      sandbox
        .stub(User, "findOne")
        .returns({ lean: sandbox.stub().resolves(null) });

      await adminController.getUser(req, res);

      expect(res.statusCode).to.equal(404);
      expect(res.body).to.have.property(
        "message",
        "User with missing@example.com not found",
      );
    });

    it("should return 200 and user details when the user exists", async () => {
      req.body = { email: "user@example.com" };
      const expectedUser = {
        _id: "user-1",
        email: "user@example.com",
        role: Role.user,
      };
      sandbox
        .stub(User, "findOne")
        .returns({ lean: sandbox.stub().resolves(expectedUser) });

      await adminController.getUser(req, res);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal({ user: expectedUser });
    });
  });

  describe("updateUser", () => {
    it("should return 403 when the requesting admin is not super admin", async () => {
      req.user.role = Role.admin;
      req.body = { oldEmail: "old@example.com", newEmail: "new@example.com" };

      await adminController.updateUser(req, res);

      expect(res.statusCode).to.equal(403);
      expect(res.body).to.have.property("message", "Forbidden");
    });

    it("should return 404 when the user to update is not found", async () => {
      req.user.role = Role.super_admin;
      req.body = {
        oldEmail: "missing@example.com",
        newEmail: "new@example.com",
      };
      sandbox
        .stub(User, "findOne")
        .returns({ lean: sandbox.stub().resolves(null) });

      await adminController.updateUser(req, res);

      expect(res.statusCode).to.equal(404);
      expect(res.body).to.have.property(
        "message",
        "User with missing@example.com not found",
      );
    });

    it("should return 200 when the user email is updated", async () => {
      req.user.role = Role.super_admin;
      req.body = { oldEmail: "old@example.com", newEmail: "new@example.com" };
      sandbox.stub(User, "findOne").returns({
        lean: sandbox.stub().resolves({ _id: "user-1", role: Role.user }),
      });
      sandbox
        .stub(User, "findByIdAndUpdate")
        .resolves({ email: "new@example.com" });

      await adminController.updateUser(req, res);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal({ updated: true });
    });
  });

  describe("deleteUser", () => {
    it("should return 403 when the requesting admin is not super admin", async () => {
      req.user.role = Role.admin;
      req.body = { email: "user@example.com" };

      await adminController.deleteUser(req, res);

      expect(res.statusCode).to.equal(403);
      expect(res.body).to.have.property("message", "Forbidden");
    });

    it("should return 404 when the user to delete does not exist", async () => {
      req.user.role = Role.super_admin;
      req.body = { email: "missing@example.com" };
      sandbox.stub(User, "findOneAndDelete").resolves(null);

      await adminController.deleteUser(req, res);

      expect(res.statusCode).to.equal(404);
      expect(res.body).to.have.property(
        "message",
        "missing@example.com not found",
      );
    });

    it("should return 204 when the user is deleted", async () => {
      req.user.role = Role.super_admin;
      req.body = { email: "user@example.com" };
      sandbox
        .stub(User, "findOneAndDelete")
        .resolves({ _id: "user-1", email: "user@example.com" });

      await adminController.deleteUser(req, res);

      expect(res.statusCode).to.equal(204);
      expect(res.body).to.be.undefined;
    });
  });

  describe("getUsers", () => {
    it("should return a users count when requested", async () => {
      req.user = { id: "admin-id", role: Role.super_admin };
      req.query = { count: true };
      sandbox.stub(User, "countDocuments").resolves(2);

      await adminController.getUsers(req, res);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal({ count: 2 });
    });
  });

  describe.skip("getUserCycles", () => {
    it("should return all cycles when no filter is provided", async () => {
      req.user = { id: "admin-id", role: Role.super_admin };
      req.body = { email: "user@example.com" };
      req.query = {};

      sandbox.stub(User, "findOne").returns({
        lean: sandbox.stub().resolves({ _id: "user-1", role: Role.user }),
      });
      sandbox
        .stub(userPopulate, "populateWithCycles")
        .resolves({ _cycles: [{ _id: "cycle-1" }] });

      await adminController.getUserCycles(req, res);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal({ allCycles: [{ _id: "cycle-1" }] });
    });
  });

  describe("getCycle", () => {
    it("should return 404 when the cycle is not found", async () => {
      req.user = { id: "admin-id", role: Role.super_admin };
      req.params = { cycleId: "cycle-id" };
      sandbox.stub(Cycle, "findById").resolves(null);

      await adminController.getCycle(req, res);

      expect(res.statusCode).to.equal(404);
      expect(res.body).to.have.property("message", "Cycle data not found");
    });

    it("should return 200 and the cycle when it exists", async () => {
      req.user = { id: "admin-id", role: Role.super_admin };
      req.params = { cycleId: "cycle-id" };
      const cycle = { _id: "cycle-id", month: 7 };
      sandbox.stub(Cycle, "findById").resolves(cycle);

      await adminController.getCycle(req, res);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal({ cycle });
    });
  });

  describe("deleteCycle", () => {
    it("should return 403 when the requesting admin is not super admin", async () => {
      req.user.role = Role.admin;
      req.params = { cycleId: "cycle-id" };

      await adminController.deleteCycle(req, res);

      expect(res.statusCode).to.equal(403);
      expect(res.body).to.have.property("message", "Forbidden");
    });

    it("should return 404 when the cycle to delete is not found", async () => {
      req.user.role = Role.super_admin;
      req.params = { cycleId: "cycle-id" };
      sandbox.stub(Cycle, "findByIdAndDelete").resolves(null);

      await adminController.deleteCycle(req, res);

      expect(res.statusCode).to.equal(404);
      expect(res.body).to.have.property("message", "Cycle not found");
    });

    it("should return 204 when the cycle is deleted", async () => {
      req.user.role = Role.super_admin;
      req.params = { cycleId: "cycle-id" };
      sandbox.stub(Cycle, "findByIdAndDelete").resolves({ _id: "cycle-id" });

      await adminController.deleteCycle(req, res);

      expect(res.statusCode).to.equal(204);
      expect(res.body).to.be.undefined;
    });
  });

  describe("createAdmin", () => {
    it("should return 403 when a non-super admin tries to create an admin", async () => {
      req.user.role = Role.admin;
      req.body = {
        email: "new-admin@example.com",
        username: "newadmin",
        password: "Password123#",
      };

      await adminController.createAdmin(req, res);

      expect(res.statusCode).to.equal(403);
      expect(res.body).to.have.property("message", "Forbidden");
    });

    it("should return 400 when the requested admin role is super admin", async () => {
      req.user.role = Role.super_admin;
      req.body = {
        email: "new-admin@example.com",
        username: "newadmin",
        password: "Password123#",
        role: Role.super_admin,
      };

      await adminController.createAdmin(req, res);

      expect(res.statusCode).to.equal(400);
      expect(res.body).to.have.property(
        "message",
        "Only ADMIN role is allowed for new admins",
      );
    });

    it("should create a new admin when the request is valid", async () => {
      req.user.role = Role.super_admin;
      req.body = {
        email: "new-admin@example.com",
        username: "newadmin",
        password: "Password123#",
        role: Role.admin,
      };

      sandbox.stub(Admin, "findOne").resolves(null);
      sandbox.stub(Admin, "create").resolves({
        _id: "created-admin-id",
        email: req.body.email,
        username: req.body.username,
        role: Role.admin,
      });
      sandbox.stub(bcrypt, "hash").resolves("hashed-password");

      await adminController.createAdmin(req, res);

      expect(res.statusCode).to.equal(201);
      expect(res.body).to.have.property(
        "message",
        "Admin created successfully",
      );
      expect(res.body).to.have.property("admin");
    });
  });

  describe("switchAdmin", () => {
    it("should return 404 when the target admin is not found", async () => {
      req.user.role = Role.super_admin;
      req.body = { email_username_id: "missing-admin", role: Role.admin };
      sandbox.stub(Admin, "findById").resolves(null);
      sandbox.stub(Admin, "findOne").resolves(null);

      await adminController.switchAdmin(req, res);

      expect(res.statusCode).to.equal(404);
      expect(res.body).to.have.property("message", "Admin not found");
    });

    it("should return 200 and update the target admin role", async () => {
      req.user.role = Role.super_admin;
      req.user.id = "super-admin-id";
      req.body = { email_username_id: "admin@example.com", role: Role.admin };
      const targetAdmin = {
        _id: "target-admin-id",
        role: Role.super_admin,
        save: sandbox.stub().resolvesThis(),
      };
      sandbox.stub(Admin, "findById").resolves(null);
      sandbox.stub(Admin, "findOne").onFirstCall().resolves(targetAdmin);

      await adminController.switchAdmin(req, res);

      expect(targetAdmin.role).to.equal(Role.admin);
      expect(targetAdmin.save.calledOnce).to.be.true;
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property("admin");
    });
  });

  describe("deactivateAdmin", () => {
    it("should return 400 when trying to deactivate a super admin", async () => {
      req.user.role = Role.super_admin;
      req.body = { email_username_id: "super-admin" };
      const superAdmin = {
        role: Role.super_admin,
        save: sandbox.stub().resolvesThis(),
      };
      sandbox.stub(Admin, "findOne").resolves(superAdmin);

      await adminController.deactivateAdmin(req, res);

      expect(res.statusCode).to.equal(400);
      expect(res.body).to.have.property(
        "message",
        "Can't deactivate a Super Admin",
      );
    });

    it("should return 200 when deactivating a regular admin", async () => {
      req.user.role = Role.super_admin;
      req.user.id = "super-admin-id";
      req.body = { email_username_id: "regular-admin@example.com" };
      const regularAdmin = {
        _id: "regular-admin-id",
        role: Role.admin,
        status: userStatus.active,
        save: sandbox.stub().resolvesThis(),
      };
      sandbox.stub(Admin, "findOne").onFirstCall().resolves(regularAdmin);

      await adminController.deactivateAdmin(req, res);

      expect(regularAdmin.status).to.equal(userStatus.deactivated);
      expect(regularAdmin.save.calledOnce).to.be.true;
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property("message", "Admin deactivated");
    });
  });
});
