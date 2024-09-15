// import request from 'supertest';
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const { User, Connection } = require('../../../models/engine/database.js');
const notifications = require('../../../services/notifications.js');
const util = require('../../../utility/encryption/cryptography.js');
const tokenVerification = require('../../../middleware/tokenVerification.js');
const { userStatus, Role, userAction, notificationStatus } = require('../../../enums.js');


describe('USER ROUTES', async () => {
  const token = "345678ertyj5678dfghj5678fgh";
  let tokenStub;
  let app;

  before(() => {
    tokenStub = sinon.stub(tokenVerification, 'userTokenVerification')
      .callsFake((req, res, next) => {
        req.user = {
          _id: 1,
          email: 'daniel.ovidot@gmail.com',
          status: userStatus.active,
          role: Role.user
        }
        next();
      });
    app = require('../../../../app.js');
  });
  
  after(() => {
    tokenStub.restore();
  });
  
  describe('FetchUser', () => {
    let sandbox;
    
    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });
    
    afterEach(() => {
      sandbox.restore();
    });
    
    it('should return 404 if user doesn\'t exist', async () => {
      sandbox.stub(User, 'findById').resolves(null);

      const res = await request(app)
      .get(`/api/v1/auth/users/fetch`)
      .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'User not found');
    });

    it('should return 404 when no user is found', async () => {
      // Mock the User.findById method to return null
      sandbox.stub(User, 'findById').resolves(true);

      const res = await request(app)
        .get('/api/v1/auth/users/fetch')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('user');
    });
  });

  describe('UpdateUser', () => {
    let updateData;
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });
  
    afterEach(() => {
      sandbox.restore();
    });

    it('should return 400 when no data is provided', async () => {
      const res = await request(app)
        .put('/api/v1/auth/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message').includes('Provide atleast one field to update');
    });

    it('should return 400 if user provide period that not valid', async () => {
      let res;
      
      update = {
        period: 9
      };

      res = await request(app)
        .put('/api/v1/auth/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send(update);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', '"period" must be less than or equal to 8');

      res = await request(app)
        .put('/api/v1/auth/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...update, period: 1 });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', '"period" must be greater than or equal to 2');
    });

    it('should return 400 if sensitive data is passed without current password', async () => {
      updateData = {
        sensitive: {
          phone: "+2348123456789"
        }
      };

      const res = await request(app)
        .put('/api/v1/auth/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message').includes('Password is required for updating sensitive fields (phone and password)');
    });

    it('should return 400 if sensitive data doesn\'t meet requirements', async () => {
      let res;
      
      updateData = {
        sensitive : {
          phone: "8123456789"
        },
        password: "Ajumnyovidot123#"
      };

      res = await request(app)
        .put('/api/v1/auth/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Phone number must start with a country code and contain only numbers.');

      res = await request(app)
        .put('/api/v1/auth/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...updateData, sensitive: { phone: "" } });
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Phone number is required.');

      res = await request(app)
        .put('/api/v1/auth/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...updateData, sensitive: { new_password: "password" } });
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.');

      res = await request(app)
        .put('/api/v1/auth/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...updateData, sensitive: { new_password: "" } });
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Password is required.');
    });

    it('should return 400 if user send dob less or greater than minimum required age', async () => {
      let res;

      // min required age is 8 and max is 58
      const minDOB = new Date();
      const maxDOB = new Date();

      minDOB.setFullYear(minDOB.getFullYear() - 2);
      maxDOB.setFullYear(maxDOB.getFullYear() - 58);

      updateData = {
        dob: minDOB
      };

      res = await request(app)
        .put('/api/v1/auth/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'You are too young or above the age to menstrate (min: 8 years, max: 58 years)');

      res = await request(app)
        .put('/api/v1/auth/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...updateData, dob: maxDOB });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'You are too young or above the age to menstrate (min: 8 years, max: 58 years)');
    });

    it('should return 404 if user is not found', async () => {
      sandbox.stub(User, 'findById').returns(null);

      updateData = {
        period: 2
      };

      const res = await request(app)
        .put('/api/v1/auth/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'User not found');
    });

    it('should return 400 when sensitive data is passed and password is incorrect', async () => {
      sandbox.stub(User, 'findById').returns({
        _id: 1,
        period: 3,
        password: await util.encrypt('Jennyovidot123#'),
        phone: "+2347012345367",
        notificationsList: []
      });

      updateData = {
        period: 3,
        password: 'Jennyovidota123#',
        sensitive: {
          phone: "+2347012345367"
        }
      };

      const res = await request(app)
        .put('/api/v1/auth/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Invalid password');
    });

    it('should update the user data', async () => {
      sandbox.stub(User, 'findById').returns({
        _id: 1,
        period: 3,
        password: await util.encrypt('Jennyovidot123#'),
        phone: "+2347012345367",
        notificationsList: [],
        save: sinon.stub().resolvesThis(true), // stub the save method
      });

      sandbox.stub(notifications, 'generateNotification').returns({
        action: userAction.updatedUser,
        itemId: null,
        message: 'User updated',
        status: notificationStatus.unread
      });

      sandbox.stub(notifications, 'manageNotification').returns(true);

      updateData = {
        period: 3
      };

      const res = await request(app)
        .put('/api/v1/auth/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);
      
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property('message', 'User succesfully updated');
      expect(res.body).to.have.property('user');
    });
  });

  describe('DeactivateUser', async () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });
  
    afterEach(() => {
      sandbox.restore();
    });

    it('should return 404 if user is not found', async () => {
      sandbox.stub(User, 'findById').returns(null);

      const res = await request(app)
        .get('/api/v1/auth/users/deactivate')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'User not found');
    });

    it('should deactivate the user', async () => {
      sandbox.stub(User, 'findById').returns({
        _id: 1,
        status: userStatus.active,
      });
      sandbox.stub(Connection, 'transaction').resolves(true);

      const res = await request(app)
        .get('/api/v1/auth/users/deactivate')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(204);
    });
  });

  describe('DeleteUser', async () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });
  
    afterEach(() => {
      sandbox.restore();
    });

    it('should return 404 if user is not found', async () => {
      sandbox.stub(User, 'findByIdAndDelete').returns(null);

      const res = await request(app)
        .delete('/api/v1/auth/users/delete')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'User not found');
    });

    it('should delete the user', async () => {
      sandbox.stub(Connection, 'transaction').resolves(true);

      const res = await request(app)
        .delete('/api/v1/auth/users/delete')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(204);
    });
  });

  describe('GetNotification', async () => {
    let sandbox;
    const notificationId = '6567a583ac12987ab4826337';

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });
  
    afterEach(() => {
      sandbox.restore();
    });

    it('should return 404 if user is not found', async () => {
      sandbox.stub(User, 'findById').returns(null);

      const res = await request(app)
        .get(`/api/v1/auth/users/notifications/${notificationId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'User not found');
    });

    it('should return 404 if notification is not found', async () => {
      sandbox.stub(User, 'findById').returns({
        _id: 1,
        notificationsList: {
          id: sinon.stub().returns(null)
        },
      });

      const res = await request(app)
        .get(`/api/v1/auth/users/notifications/${notificationId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'Notification not found');
    });

    it('should return 200 if notification is found and change to read', async () => {
      const notification = { _id: notificationId, status: notificationStatus.unread };
      const user = {
        notificationsList: {
          id: sandbox.stub().returns([notification]), // Stubbing id method
          map: sandbox.stub().returns([notification])
        },
        save: sandbox.stub().resolves()
      };
      
      sandbox.stub(User, 'findById').returns(user);

      const res = await request(app)
        .get(`/api/v1/auth/users/notifications/${notificationId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('note');
    });
  });

  describe('GetNotifications', async () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });
  
    afterEach(() => {
      sandbox.restore();
    });

    it('should return 404 if user is not found', async () => {
      sandbox.stub(User, 'findById').returns(null);

      const res = await request(app)
        .get('/api/v1/auth/users/notifications')
        .set('Authorization', `Bearer ${token}`);
    });

    it('should return 200 and notifications', async () => {
      const user = {
        notificationsList: [
          {
            _id: '6567a583ac12987ab4826337',
            status: notificationStatus.unread
          },
          {
            _id: '6567a583ac12987ab4826338',
            status: notificationStatus.unread
          }
        ]
      };

      sandbox.stub(User, 'findById').returns(user);

      const res = await request(app)
        .get('/api/v1/auth/users/notifications')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('notifications');
    });
  });

  describe('DeleteNotification', async () => {
    let sandbox;
    const notificationId = '6567a583ac12987ab4826337';

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return 404 if no user is found', async () => {
      sandbox.stub(User, 'findById').returns(null);

      const res = await request(app)
        .delete(`/api/v1/auth/users/notifications/${notificationId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'User not found');
    });

    it('should return 404 if notification is not found', async () => {
      sandbox.stub(User, 'findById').returns({
        _id: 1,
        notificationsList: {
          id: sinon.stub().returns(null)
        },
      });

      const res = await request(app)
        .delete(`/api/v1/auth/users/notifications/${notificationId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("message", "Notification not found");
    });

    it('should successfully delete notification', async () => {
      const notification = { _id: notificationId, status: notificationStatus.unread };
      const user = {
        _id: 1,
        notificationsList: {
          id: sandbox.stub().returns([notification]), // Stubbing id method
          filter: sandbox.stub().returns([])
        },
        save: sandbox.stub().resolves()
      };
      sandbox.stub(User, 'findById').returns(user);

      const res = await request(app)
        .delete(`/api/v1/auth/users/notifications/${notificationId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(204);
    });
  });
});
