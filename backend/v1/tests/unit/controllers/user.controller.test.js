require("dotenv").config();
const { expect } = require("chai");
const sinon = require("sinon");
const { User } = require("../../../models/engine/database.js");
const userController = require("../../../controllers/user.controller.js");
const { notificationStatus } = require("../../../enums.js");

describe("USER CONTROLLER", () => {
  let sandbox;
  let req;
  let res;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      body: {},
      params: {},
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

  it("should return 400 when the notification id is missing", async () => {
    await userController.getNotification(req, res);

    expect(res.statusCode).to.equal(400);
    expect(res.body).to.deep.equal({
      message: "Invalid request, id is required",
    });
  });

  it("should return 404 when notifications are requested for a missing user", async () => {
    sandbox
      .stub(User, "findById")
      .returns({ lean: sandbox.stub().resolves(null) });

    await userController.getNotifications(req, res);

    expect(res.statusCode).to.equal(404);
    expect(res.body).to.deep.equal({ message: "User not found" });
  });

  it("should mark all notifications as read", async () => {
    const note = { status: notificationStatus.unread };
    const user = {
      notificationsList: [note],
      save: sandbox.stub().resolvesThis(),
    };
    sandbox.stub(User, "findById").resolves(user);

    await userController.readAllNotifications(req, res);

    expect(note.status).to.equal(notificationStatus.read);
    expect(user.save.calledOnce).to.be.true;
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.deep.equal({ message: "successful" });
  });
});
