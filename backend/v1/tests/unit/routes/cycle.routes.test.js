const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const { Cycle } = require('../../../models/engine/database.js');
const userPopulate = require('../../../utility/helpers/user.populate.js');
const cycleHelper = require('../../../utility/helpers/cycle.helpers.js');
const redisManager = require('../../../services/caching.js');
const tokenVerification = require('../../../middleware/tokenVerification.js');
const { userStatus, Role, userAction, notificationStatus } = require('../../../enums.js');


describe('CYCLE ROUTES', () => {
  const token = "345678ertyj5678dfghj5678fgh";
  let tokenStub;
  let app;
  let user;
  let cycle;

  before(() => {
    tokenStub = sinon.stub(tokenVerification, 'userTokenVerification')
      .callsFake((req, res, next) => {
        req.user = {
          id: 1,
          email: 'daniel.ovidot@gmail.com',
          status: userStatus.active,
          role: Role.user
        }
        next();
      });
    app = require('../../../../app.js');

    user = {
      _id: 1,
      email: 'daniel.ovidot@gmail.com',
      phone: '+2347064616647',
      username: "Reaper",
      role: "USER",
      status: "ACTIVE",
      _cycles: [],
      notificationsList: []
    };

    cycle = {
      month: "September",
      year: "2024",
      period: 4,
      ovulation: new Date("2024-09-20T00:00:00.000+00:00"),
      start_date: "2024-09-07T00:00:00.000+00:00",
      next_date: "2024-10-05T00:00:00.000+00:00",
      days: 28
    }
  });

  after(() => {
    tokenStub.restore();
  });

  describe('CreateCycle', () => {
    let sandbox;
    let cycleData;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox.useFakeTimers(new Date('2023-11-26').getTime());
    });

    afterEach(() => {
      sandbox.restore()
    });

    it('should return 400 if required parameter (startdate) isn\'t specified', async () => {
      cycleData = {
        period: 4
      }

      const res = await request(app)
        .post('/api/v1/auth/cycles/create')
        .set('Authorization', `Bearer ${token}`)
        .send(cycleData);

      expect(res.statusCode).to.equal(400);
      expect(res.body).to.have.property("message", '"startdate" is required');
    });

    it('should return 404 if user is not found', async () => {
      sandbox.stub(userPopulate, 'populateWithCycles').resolves(null);

      cycleData = {
        period: 4,
        startdate: '2023-11-26'
      };

      const res = await request(app)
        .post('/api/v1/auth/cycles/create')
        .set('Authorization', `Bearer ${token}`)
        .send(cycleData);

      expect(res.statusCode).to.equal(404);
      expect(res.body).to.have.property("message", 'User not found');
    });

    it('should return 400 when startdate is invalid', async () => {
      sandbox.stub(userPopulate, 'populateWithCycles').resolves(user);

      cycleData = {
        period: 4,
        startdate: '2023-11-01'
      };

      const res = await request(app)
        .post('/api/v1/auth/cycles/create')
        .set('Authorization', `Bearer ${token}`)
        .send(cycleData);

      expect(res.statusCode).to.equal(400);
      expect(res.body).to.have.property("message", 'Specify a proper date: Date should not be less than 21 days or greater than present day');
    });

    it('should return 400 if cycle already exist', async () => {
      sandbox.stub(userPopulate, 'populateWithCycles').resolves(user);
      sandbox.stub(cycleHelper, "checkExistingCycle").returns(true);

      cycleData = {
        period: 4,
        startdate: '2023-11-26'
      };

      const res = await request(app)
        .post('/api/v1/auth/cycles/create')
        .set('Authorization', `Bearer ${token}`)
        .send(cycleData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message", "Cycle already exist for this month: Delete to create another");
    });

    it('should successfully create cycle', async () => {
      sandbox.stub(userPopulate, 'populateWithCycles').resolves(user);
      sandbox.stub(cycleHelper, "checkExistingCycle").returns(false);
      sandbox.stub(Cycle, 'create').resolves(cycle);
      sandbox.stub(cycleHelper, 'createCycleAndNotifyUser').resolves(true);
      sandbox.stub(redisManager, 'cacheDel').resolves(true)

      cycleData = {
        period: 4,
        startdate: '2023-11-26'
      };

      const res = await request(app)
        .post('/api/v1/auth/cycles/create')
        .set('Authorization', `Bearer ${token}`)
        .send(cycleData);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'Cycle created');
    });
  });

  describe('FetchAllCycles', async () => {
    let sandbox;
    let cycleData;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox.useFakeTimers(new Date('2023-11-26').getTime());
    });

    afterEach(() => {
      sandbox.restore()
    });

    it('should return 400 if a required parameter is not passed', async () => {
      cycleData = {
        month: 1
      };

      const res = await request(app)
        .get(`/api/v1/auth/cycles/getall?month=${cycleData.month}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', '"year" is required');
    });

    it('should return 400 if wrong month is passed', async () => {
      let res;
      cycleData = {
        month: 0,
        year: "2023"
      };

      res = await request(app)
        .get(`/api/v1/auth/cycles/getall?month=${cycleData.month}&year=${cycleData.year}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(400)
      expect(res.body).to.have.property('message', '"month" must be greater than or equal to 1');

      res = await request(app)
        .get(`/api/v1/auth/cycles/getall?month=13&year=${cycleData.year}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(400)
      expect(res.body).to.have.property('message', '"month" must be less than or equal to 12');

      res = await request(app)
        .get(`/api/v1/auth/cycles/getall?month=mat&year=${cycleData.year}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(400)
      expect(res.body).to.have.property('message',
        '"month" must be one of [number, January, February, March, April, May, June, July, August, September, October, November, December]'
      );
    });
    
    it('should return 400 if wrong year is passed', async () => {
      let res;
      cycleData = {
        month: 1,
        year: "1969"
      };
      
      res = await request(app)
        .get(`/api/v1/auth/cycles/getall?month=${cycleData.month}&year=${cycleData.year}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(400)
      expect(res.body).to.have.property('message', '"year" must be greater than or equal to 1970');

      res = await request(app)
        .get(`/api/v1/auth/cycles/getall?month=${cycleData.month}&year=2101`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(400)
      expect(res.body).to.have.property('message', '"year" must be less than or equal to 2100');
    });

    it('should return 404 if User is not found', async () => {
      sandbox.stub(redisManager, 'cacheGet').resolves(null);
      sandbox.stub(userPopulate, 'populateWithCyclesBy').resolves(null);

      cycleData = {
        month: 1,
        year: "2023"
      };

      const res = await request(app)
        .get(`/api/v1/auth/cycles/getall?month=${cycleData.month}&year=${cycleData.year}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'User not found');
    });

    it('should successfully fetch cycles', async () => {
      sandbox.stub(redisManager, 'cacheGet').resolves(null);
      sandbox.stub(userPopulate, 'populateWithCyclesBy').resolves({
        ...user,
        _cycles: {
          map: sinon.stub().resolvesThis(true)
        }
      });

      cycleData = {
        month: 1,
        year: "2023"
      };

      const res = await request(app)
        .get(`/api/v1/auth/cycles/getall?month=${cycleData.month}&year=${cycleData.year}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(200);
    });
  });

  describe('FetchOneCycle', () => {
    let sandbox;
    const cycleId = '66dcd446a0fe28cd6d78d605';

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox.useFakeTimers(new Date('2023-11-26').getTime());
    });

    afterEach(() => {
      sandbox.restore()
    });

    it('should return 404 if User is not found', async () => {
      sandbox.stub(userPopulate, 'populateWithCyclesBy').resolves(null);

      const res = await request(app)
        .get(`/api/v1/auth/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'User not found');
    });

    it('should return 404 if cycle is not found', async () => {
      sandbox.stub(userPopulate, 'populateWithCyclesBy').resolves(user);

      const res = await request(app)
        .get(`/api/v1/auth/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'Cycle not found');
    });

    it('should return 200 if cycle is found', async () => {
      sandbox.stub(userPopulate, 'populateWithCyclesBy').resolves({ ...user, _cycles: [cycle] });

      const res = await request(app)
        .get(`/api/v1/auth/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
    });
  });

  describe('UpdateCycle', () => {
    let sandbox;
    let cycleData;
    const cycleId = '66dcd446a0fe28cd6d78d605';

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox.useFakeTimers(new Date('2024-09-30').getTime());
    });

    afterEach(() => {
      sandbox.restore()
    });

    it('should return 400 when no parameter to update is paseed', async () => {
      cycleData = {};

      const res = await request(app)
        .put(`/api/v1/auth/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(cycleData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message').includes('Provide atleast one field to update');
    });

    it('should return 404 if User is not found', async () => {
      sandbox.stub(userPopulate, 'populateWithCyclesBy').resolves(null);
      cycleData = {
        period: 4
      };

      const res = await request(app)
        .put(`/api/v1/auth/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(cycleData);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'User not found');
    });

    it('should return 404 if cycle is not found', async () => {
      sandbox.stub(userPopulate, 'populateWithCyclesBy').resolves(user);
      cycleData = {
        period: 4
      };

      const res = await request(app)
        .put(`/api/v1/auth/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(cycleData);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'Cycle not found');
    });

    it('it should return 400 if period and ovulation are the same with the cycle to update', async () => {
      let res;
      sandbox.stub(userPopulate, 'populateWithCyclesBy').resolves({ ...user, _cycles: [cycle] });
      cycleData = {
        period: 4,
        ovulation: "2024-09-20"
      };

      res = await request(app)
        .put(`/api/v1/auth/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(cycleData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Can\'t update the cycle with the same period and ovulation');
      console.log('yes')
      // using the same period only
      res = await request(app)
        .put(`/api/v1/auth/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ period: 4 });

      expect(res.status).to.equal(400)
      expect(res.body).to.have.property('message', 'Can\'t update the cycle with the same period');

      // using the same ovulation only
      res = await request(app)
        .put(`/api/v1/auth/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ovulation: '2024-09-20' });

      expect(res.status).to.equal(400)
      expect(res.body).to.have.property('message', 'Can\'t update the cycle with the same ovulation');
    });

    it('should return 400 if user tries to update cycle > 30 days old', async () => {
      // back date cycle start date
      sandbox.stub(userPopulate, 'populateWithCyclesBy').resolves({
        ...user,
        _cycles: [{
          ...cycle,
          start_date: "2023-08-02T00:00:00.000+00:00"
        }]
      });
      cycleData = {
        period: 3
      };
      const res = await request(app)
        .put(`/api/v1/auth/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(cycleData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Update can\'t be made after 30 days from current cycle start date');
    });

    it('it should return 400 if ovulation exceeds 18 days from start date', async () => {
      sandbox.stub(userPopulate, 'populateWithCyclesBy').resolves({ ...user, _cycles: [cycle] });
      cycleData = {
        ovulation: "2024-09-30T00:00:00.000+00:00"
      };

      const res = await request(app)
        .put(`/api/v1/auth/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(cycleData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Ovulation date must not exceed 18 days from start date');
    });

    it('should successfully update cycle', async () => {
      sandbox.stub(userPopulate, 'populateWithCyclesBy').resolves({ ...user, _cycles: [cycle] });
      sandbox.stub(cycleHelper, 'performUpdateAndNotify').resolves(cycle);
      sandbox.stub(redisManager, 'cacheDel').resolves(true);
      
      cycleData = {
        period: 4,
        ovulation: "2024-09-30T00:00:00.000+00:00"
      };

      const res = await request(app)
        .put(`/api/v1/auth/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(cycleData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Ovulation date must not exceed 18 days from start date');
    });
  });

  describe('DeleteCycle', () => {
    let sandbox;
    let cycleData;
    const cycleId = '66dcd446a0fe28cd6d78d605';

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox.useFakeTimers(new Date('2024-09-30').getTime());
    });

    afterEach(() => {
      sandbox.restore()
    });

    it('should return 404 if User is not found', async () => {
      sandbox.stub(userPopulate, 'populateWithCyclesBy').resolves(null);
      
      const res = await request(app)
        .delete(`/api/v1/auth/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(404)
      expect(res.body).to.have.property('message', "User not found");
    });
    
    it('should return 404 if Cycle is not found', async () => {
      sandbox.stub(userPopulate, 'populateWithCyclesBy').resolves(user);
      
      const res = await request(app)
        .delete(`/api/v1/auth/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404)
      expect(res.body).to.have.property('message', "Cycle not found");
    });
    
    it('should successfully delete cycle', async () => {
      sandbox.stub(userPopulate, 'populateWithCyclesBy').resolves({ ...user, _cycles: [cycle] });
      sandbox.stub(cycleHelper, 'performDeleteAndNotify').resolves(cycle);
      sandbox.stub(redisManager, 'cacheDel').resolves(true);

      const res = await request(app)
        .delete(`/api/v1/auth/cycles/${cycleId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(204)
    });
  });
});
