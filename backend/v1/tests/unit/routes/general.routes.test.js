const { expect } = require('chai');
const app = require('../../../../app.js');
const request = require('supertest');
const sinon = require('sinon');
const util = require('../../../utility/encryption/cryptography.js');
const { User, Connection } = require('../../../models/engine/database.js');
const blacklist = require('../../../middleware/tokenBlacklist.js');
const userController = require('../../../controllers/user.controller.js');


describe('GENERAL ROUTES', () => {
  let sandbox;

  describe('Signup', () => {
    let userData;

    beforeEach(async () => {
      sandbox = sinon.createSandbox();
    });
  
    afterEach(() => {
      sandbox.restore();
    });
  
    it('should return 400 if a required param isn\'t given', async () => {
      // phone not specified
      userData = {
        fname: "Daniel",
        lname: "Eyang",
        email: 'daniel.eyang.ed@gmail.com',
        password: 'Ovidotsuper123#',
        dob: '1996-05-30',
        period: 5,
      };
  
      sandbox.stub(userController, 'createUser').callsFake((res) => {
        res.status(500).json({ message: "We have a Mongoose Error" });
      });

      const res = await request(app)
        .post('/api/v1/signup')
        .send(userData);
  
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', `Phone number is required.`);
    });
  
    it('should return 400 when an invalid email is passed', async () => {
      let res;
      
      userData = {
        fname: "Daniel",
        lname: "Eyang",
        email: 'daniel.eyang.ed@gmail.cng',
        username: "Reaper",
        phone: "+2347064618847",
        password: 'Ovidotsuper123#',
        dob: '1996-05-30',
        period: 5,
      };
  
      sandbox.stub(userController, 'createUser').callsFake((res) => {
        res.status(500).json({ message: "We have a Mongoose Error" });
      });
  
      // Invalid email domain
      res = await request(app)
        .post('/api/v1/signup')
        .send(userData);
  
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', "Please provide a valid email address with a domain such as example.com or example.ng etc.");
      
      // Empty mail string is passed
      res = await request(app)
        .post('/api/v1/signup')
        .send({ ...userData, email: ""});
  
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', "Email is required.");
    });
  
    it('should return 400 when an invalid phone number is passed', async () => {
      let res;
      
      userData = {
        fname: "Daniel",
        lname: "Eyang",
        email: 'daniel.eyang.ed@gmail.cng',
        username: "Reaper",
        phone: "07064618847",
        password: 'Ovidotsuper123#',
        dob: '1996-05-30',
        period: 5,
      };
  
      sandbox.stub(userController, 'createUser').callsFake((res) => {
        res.status(500).json({ message: "We have a Mongoose Error" });
      });
  
      // No country code
      res = await request(app)
        .post('/api/v1/signup')
        .send(userData);
  
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', "Phone number must start with a country code and contain only numbers.");
  
      // Empty phone field
      res = await request(app)
        .post('/api/v1/signup')
        .send({...userData, phone: ""});
  
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', "Phone number is required.");
    });

    it('should return 400 when an invalid username is passed', async () => {
      userData = {
        fname: "Daniel",
        lname: "Eyang",
        email: 'daniel.eyang.ed@gmail.cng',
        username: "Reaper$",
        phone: "07064618847",
        password: 'Ovidotsuper123#',
        dob: '1996-05-30',
        period: 5,
      };
  
      // Invalid email domain
      const res = await request(app)
        .post('/api/v1/signup')
        .send(userData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message", "Username must contain only alphabetic characters.")
    })
  
    it('should return 400 when an invalid password is passed', async () => {
      let res;
  
      userData = {
        fname: "Daniel",
        lname: "Eyang",
        email: 'daniel.eyang.ed@gmail.com',
        username: "Reaper",
        phone: "+2347064618847",
        password: 'Ovidotsur123',
        dob: '1996-05-30',
        period: 5,
      };
  
      sandbox.stub(userController, 'createUser').callsFake((res) => {
        res.status(500).json({ message: "We have a Mongoose Error" });
      });
  
      // No country code
      res = await request(app)
        .post('/api/v1/signup')
        .send(userData);
  
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.");
  
      // Empty phone field
      res = await request(app)
        .post('/api/v1/signup')
        .send({...userData, password: ""});
  
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', "Password is required.");
    });
  
    it('should return 400 if the user is already registered', async () => {
      userData = {
        fname: "Daniel",
        lname: "Eyang",
        email: 'daniel.eyang.ed@gmail.com',
        username: "Reaper",
        phone: "+2347064618847",
        password: 'Ovidotsur123#',
        dob: '1996-05-30',
        period: 5,
      };
  
      sandbox.stub(userController, 'createUser').callsFake((res) => {
        res.status(400).json({ message: "Email already exists" });
      });
  
      const res = await request(app)
        .post('/api/v1/signup')
        .send(userData);
  
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', "Email already exists");
    })
  
    it('should create a new user', async () => {
      userData = {
        fname: "Daniel",
        lname: "Eyang",
        email: 'daniel.eyang.ed@gmail.com',
        username: "Reaper",
        phone: "+2347064618847",
        password: 'Ovidotsuper123#',
        dob: '1996-05-30',
        period: 5,
      };
  
      sandbox.stub(userController, 'createUser').callsFake((res) => {
        res.status(201).json({ message: "Registration Successful" });
      });
  
      const res = await request(app)
        .post('/api/v1/signup')
        .send(userData);
  
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', "Registration Successful");
    });
  });

  describe('Login', () => {
    let loginData;

    beforeEach(async () => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return 400 if required param isn\'t given', async () => {
      loginData = {
        email_or_phone: "daniel.eyang.ed@gmail.com"
      };

      const res = await request(app)
        .post('/api/v1/login')
        .send(loginData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', '"password" is required');
    });

    it('should return 400 if invalid email or phone is passed', async () => {
      loginData = {
        email_or_phone: "daniel.ovidtot@gmail.com",
        password: "telegramthe123#"
      };

      sandbox.stub(User, 'findOne').returns(null);

      const res = await request(app)
        .post('/api/v1/login')
        .send(loginData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', "email, phone or password incorrect");
    });

    it('should return 400 if user is deactivated', async () => {
      loginData = {
        email_or_phone: "daniel.ovidot@gmail.com",
        password: "telegramthe123#"
      };

      sandbox.stub(User, 'findOne').returns({
        status: "DEACTIVATED"
      });

      const res = await request(app)
        .post('/api/v1/login')
        .send(loginData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', "Account deactivated - resolve with: /api/v1/general/forget-password");
    });

    it('should return 400 if password is incorrect', async () => {
      loginData = {
        email_or_phone: "daniel.ovidot@gmail.com",
        password: "telegramthe123#"
      };

      sandbox.stub(User, 'findOne').returns({
        status: "ACTIVE",
        password: "telegramthis123#"
      });

      const res = await request(app)
        .post('/api/v1/login')
        .send(loginData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', "email, phone or password incorrect");
    });

    it('should successfully login', async () => {
      loginData = {
        email_or_phone: "daniel.ovidot@gmail.com",
        password: "telegramthe123#"
      };

      sandbox.stub(User, 'findOne').returns({
        status: "ACTIVE",
        password: await util.encrypt(loginData.password),
        _id: '12345',
        email: "daniel.ovidot@gmail.com"
      });

      const res = await request(app)
        .post('/api/v1/login')
        .send(loginData);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Authentication successful');
      expect(res.body).to.have.property('token');
    });
  });

  describe('ForgetPass', async () => {
    let forgetPassData;

    beforeEach(async () => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return 400 if required param isn\'t given', async () => {
      forgetPassData = {
        email: "daniel.eyang.ed@gmail.com"
      };

      const res = await request(app)
        .post('/api/v1/forgot-password')
        .send(forgetPassData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', '"front_url" is required');
    });

    it('should return 400 if invalid email is passed', async () => {
      let res;

      forgetPassData = {
        email: "daniel.eyang.ed@gmail.pna",
        front_url: "https://ovidot.com"
      };

      res = await request(app)
        .post('/api/v1/forgot-password')
        .send(forgetPassData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Please provide a valid email address with a domain such as example.com or example.ng etc.');

      res = await request(app)
        .post('/api/v1/forgot-password')
        .send({ ...forgetPassData, email: ""});

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Email is required.');
    });

    it('should return 404 if email doesn\'t exist', async () => {
      forgetPassData = {
        email: "daniel.eyang.ed@gmail.com",
        front_url: "https://ovidot.com"
      };

      sandbox.stub(User, 'findOne').returns(null);

      const res = await request(app)
        .post('/api/v1/forgot-password')
        .send(forgetPassData);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', `${forgetPassData.email} not found`);
    });

    it('should successfully resolve forget password', async () => {
      forgetPassData = {
        email: "daniel.eyang.ed@gmail.com",
        front_url: "https://ovidot.com"
      }

      sandbox.stub(User, 'findOne').returns({
        email: "daniel.eyang.ed@gmail.com"
      });

      sandbox.stub(Connection, 'transaction').resolves(true);

      const res = await request(app)
        .post('/api/v1/forgot-password')
        .send(forgetPassData);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', `Password reset link succesfully sent to ${forgetPassData.email}`);
    });
  });

  describe('VerifyResetPass', async () => {
    const token = '3456ty67ighjvbnghj7ui89op';

    beforeEach(async () => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return 401 if token isn\'t passed', async () => {
      const res = await request(app)
        .get('/api/v1/reset-password/');

      expect(res.status).to.equal(404);
    });

    it('should return 401 if a token is blacklisted', async () => {
      sandbox.stub(blacklist, 'isTokenBlacklisted').returns(true);
      
      const res = await request(app)
        .get(`/api/v1/reset-password/${token}`);

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Invalid or expired token');
    });

    it('should return 401 if token has expired', async () => {
      sandbox.stub(blacklist, 'isTokenBlacklisted').returns(false);
      sandbox.stub(User, 'findOne').returns(null); // means token resetExp is less than present time

      const res = await request(app)
        .get(`/api/v1/reset-password/${token}`);

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Invalid or expired token');
    });

    it('should successful verify reset password', async () => {
      sandbox.stub(blacklist, 'isTokenBlacklisted').returns(false);
      sandbox.stub(User, 'findOne').returns({ email: "daniel.eyang.ed@gmail.com" });

      const res = await request(app)
        .get(`/api/v1/reset-password/${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'success');
      expect(res.body).to.have.property('token', '3456ty67ighjvbnghj7ui89op');
    });
  });

  describe('ResetPassword', async () => {
    let resetPassData;

    beforeEach(async () => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return 400 if a required param isn\'t given', async () => {
      resetPassData = {
        new_password: 'Ovidotal123#'
      };

      const res = await request(app)
        .put('/api/v1/reset-password')
        .send(resetPassData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', '"token" is required');
    });

    it('should return 400 when password doesn\'t meet the requirements', async () => {
      let res;
      
      resetPassData = {
        token: '3456ty67ighjvbnghj7ui89op',
        new_password: 'Ovidotal'
      };

      res = await request(app)
        .put('/api/v1/reset-password')
        .send(resetPassData);
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.');

      res = await request(app)
        .put('/api/v1/reset-password')
        .send({...resetPassData, new_password: ""});
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Password is required.');
    });

    it('should return 401 when token is blacklisted', async () => {
      sandbox.stub(blacklist, 'isTokenBlacklisted').returns(true);

      resetPassData = {
        token: '3456ty67ighjvbnghj7ui89op',
        new_password: 'Ovidotal123#'
      };

      const res = await request(app)
        .put('/api/v1/reset-password')
        .send(resetPassData);

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Invalid request, expired token');
    });

    it('should return 200 on successful password reset', async () => {
      resetPassData = {
        token: '3456ty67ighjvbnghj7ui89op',
        new_password: 'Ovidotal123#'
      };

      sandbox.stub(blacklist, 'isTokenBlacklisted').returns(false);
      sandbox.stub(User, 'findOne').returns({ email: "daniel.eyang.ed@gmail.com" });

      sandbox.stub(Connection, 'transaction').resolves(true);

      const res = await request(app)
        .put('/api/v1/reset-password')
        .send(resetPassData);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Password successfully updated');
    });
  });
});
