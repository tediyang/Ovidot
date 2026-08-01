const { expect } = require("chai");
const mongoose = require("mongoose");
const userSchema = require("../../../models/schemas/user.model.js");
const cycleSchema = require("../../../models/schemas/cycle.model.js");
const emailSchema = require("../../../models/schemas/email.model.js");
const {
  Role,
  userStatus,
  emailStatus,
  emailType,
} = require("../../../enums.js");
const { encryptText } = require("../../../utility/encryption/encryption.js");

describe("MODEL SCHEMAS", () => {
  const createModel = (schema, name) => {
    const modelName = `${name}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return mongoose.model(modelName, schema);
  };

  it("applies defaults and validates a user document", () => {
    const User = createModel(userSchema, "UserSchemaTest");
    const user = new User({
      name: { fname: "John", lname: "Doe" },
      email: "john@example.com",
      phone: "+2348130001111",
      username: "john",
      password: "Password123#",
      dob: "1995-01-01",
      period: 5,
    });

    const validationError = user.validateSync();

    expect(validationError).to.equal(undefined);
    expect(user.role).to.equal(Role.user);
    expect(user.status).to.equal(userStatus.active);
    expect(user.loginAttempts).to.equal(0);
    expect(user.notificationsList).to.be.an("array").that.is.empty;
  });

  it("rejects invalid usernames and phone numbers on the user schema", () => {
    const User = createModel(userSchema, "UserSchemaValidationTest");
    const invalidUser = new User({
      name: { fname: "John", lname: "Doe" },
      email: "john@example.com",
      phone: "08130001111",
      username: "john123",
      password: "Password123#",
      dob: "1995-01-01",
    });

    const validationError = invalidUser.validateSync();

    expect(validationError.errors.username.message).to.include(
      "only alphabets",
    );
    expect(validationError.errors.phone.message).to.include(
      "valid phone number",
    );
  });

  it("gives email documents default values and validates required fields", () => {
    const Email = createModel(emailSchema, "EmailSchemaTest");
    const emailDoc = new Email({
      email: "ada@example.com",
      username: "Ada",
      email_type: emailType.welcome,
    });

    expect(emailDoc.status).to.equal(emailStatus.pending);

    const invalidDoc = new Email({ email: "", username: "", email_type: "" });
    const validationError = invalidDoc.validateSync();

    expect(validationError.errors.email).to.exist;
    expect(validationError.errors.username).to.exist;
    expect(validationError.errors.email_type).to.exist;
  });

  it("decrypts sensitive cycle values when converting to JSON", () => {
    const Cycle = createModel(cycleSchema, "CycleSchemaTest");
    const cycleDoc = new Cycle({
      month: "July",
      year: "2024",
      period: 4,
      ovulation: encryptText("2024-07-10"),
      start_date: encryptText("2024-07-01"),
      next_date: encryptText("2024-07-22"),
      days: 28,
      period_range: [encryptText("2024-07-01")],
      ovulation_range: [encryptText("2024-07-10")],
      unsafe_days: [encryptText("2024-07-15")],
    });

    const payload = cycleDoc.toJSON();

    expect(payload.ovulation).to.equal("2024-07-10");
    expect(payload.start_date).to.equal("2024-07-01");
    expect(payload.next_date).to.equal("2024-07-22");
    expect(payload.period_range[0]).to.be.instanceOf(Date);
    expect(payload.ovulation_range[0]).to.be.instanceOf(Date);
    expect(payload.unsafe_days[0]).to.be.instanceOf(Date);
  });
});
