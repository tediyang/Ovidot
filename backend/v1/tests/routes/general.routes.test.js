import { expect } from 'chai';
import app from '../../../app.js';
import mongoose from 'mongoose';
import request from 'supertest';
import sinon from 'sinon';
import User from '../../models/user.model.js';


describe('POST /signup', () => {
  let userData;

  before(() => {
    userData = {
      email: 'daniel.eyang.ed@ovidot.com',
      password: 'Ovidotsuper',
      username: 'testuser',
      age: 18
    };
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/v1/signup')
      .send(userData);

    expect(res.status).to.equal(201);
  });

  it('should return 400 for missing properties', async () => {
    const userData = {
      email: 'daniel.eyang.ed@ovidot.com',
      password: 'Ovidotsuper',
      username: 'testuser'
    };

    const res = await request(app)
      .post('/api/v1/signup')
      .send(userData);

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message', 'Fill required properties');
  });

  it('should return 404 error if user already exist', async () => {
    const res = await request(app)
      .post('/api/v1/signup')
      .send(userData);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('message', `${userData.email} already exist.`);
  });
});


describe('POST /login', () => {
  it('should return 200 and token on success', async () => {
    const userData = {
      email: 'daniel.eyang.ed@ovidot.com',
      password: 'Ovidotsuper'
    };

    const res = await request(app)
      .post('/api/v1/login')
      .send(userData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Authentication successful');
    expect(res.body).to.have.property('token');
  });

  it('should return 400 for missing properties', async () => {
    const userData = {
      email: 'daniel.eyang.ed@ovidot.com'
    };

    const res = await request(app)
      .post('/api/v1/login')
      .send(userData);

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message', 'Fill required properties');
  });

  it('should return 404 on wrong email', async () => {
    const userData = {
      email: 'daniel.eyang@ovidot.com',
      password: 'Ovidotsuper'
    };

    const res = await request(app)
      .post('/api/v1/login')
      .send(userData);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('message', "email doesn't exist");
  });

  it('should return 401 when an incorrect password is enter', async () => {
    const userData = {
      email: 'daniel.eyang.ed@ovidot.com',
      password: 'Ovidotsu'
    };

    const res = await request(app)
      .post('/api/v1/login')
      .send(userData);

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message', 'Incorrect Password');
  });
});


describe('POST /forgot-password', () => {
  it('should send a reset password link', async () => {
    const userData = {
      email: 'daniel.eyang.ed@ovidot.com',
      url: 'http://ovidot.com/forgetPass'
    };

    const res = await request(app)
      .post('/api/v1/forgot-password')
      .send(userData);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('message', 'Password reset link sent to email');
  });

  it('should return 400 when body parameters ae missing', async () => {
    const userData = {
      email: 'daniel.eyang.ed@ovidot.com'
    };

    const res = await request(app)
      .post('/api/v1/forgot-password')
      .send(userData);

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message', 'Fill required properties');
  });
});


describe('GET /reset-password/:token', () => {
  let findOneStub;

  before(() => {
    // Stub the User.findOne method
    findOneStub = sinon.stub(User, 'findOne');
  });

  after(async () => {
    // Restore the original method
    findOneStub.restore();
  });

  it('should return 404 when no token is specified', async () => {
    const res = await request(app)
      .get('/api/v1/reset-password');

    expect(res.status).to.equal(404);
  });

  it('should return 401 when token is blacklisted', async () => {
    const token = '23456dfghjvgbhnjmcvtbyuu.rtfgyhnjfdvcbhnjdfv';

    const res = await request(app)
      .get(`/api/v1/reset-password/${token}`);

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message', 'Invalid or expired token');
  });

  it('should return 401 when token is invalid', async () => {
    const token = '23456dfghjvgbhnjmcvtbyuu.vbhnjybudngfjmcdfghh';

    const res = await request(app)
      .get(`/api/v1/reset-password/${token}`);

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message', 'Invalid or expired token');
  });

  it('should return 200 and token on success ', async () => {
    const token = 'vbynujimkgfvfkdmvyrh67849043rfdlv.fdvfdbhdbhbf7e830dsks';

    // Return a user with the given token
    findOneStub.returns({
      reset: token,
      resetExp: new Date(Date.now() + 1800000)
    });

    const res = await request(app)
      .get(`/api/v1/reset-password/${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'success');
    expect(res.body).to.have.property('token', token);
  });
});


describe('POST /reset-password/:token', () => {
  let findOneStub;

  before(() => {
    // Stub the User.findOne method
    findOneStub = sinon.stub(User, 'findOne');
  });

  after(async () => {
    // Restore the original method
    findOneStub.restore();
    // drop the data from the base
    await mongoose.connection.dropDatabase();
    // Close the server after tests
    await mongoose.connection.close();
  });

  it('should return 400 when body parameters ae missing', async () => {
    const token = 'vgbhfdnjcvnidsivoiojesddv.fvhuishfd7678df98vnsubvsd'

    const res = await request(app)
      .post(`/api/v1/reset-password/${token}`)
      .send({});

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message', 'Fill required properties');
  });

  it('should return 401 when token is blacklisted', async () => {
    const token = '23456dfghjvgbhnjmcvtbyuu.rtfgyhnjfdvcbhnjdfv';
    const password = 'Ovidot123';

    const res = await request(app)
      .post(`/api/v1/reset-password/${token}`)
      .send({ password });

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message', 'Invalid or expired token');
  });

  it('should return 401 when token is invalid', async () => {
    const token = '23456dfghjvgbhnjmcvtbyuu.rtfgyhnjfdvcbhnjdmj';
    const password = 'Ovidot123';

    const res = await request(app)
    .post(`/api/v1/reset-password/${token}`)
    .send({ password });

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message', 'Invalid or expired token');
  });

  it('should reset the user password', async () => {
    const token = 'vbynujimkgfvfkdmvyrh67849043rfdlv.fdvfdbhdbhbf7e830dsks';
    const password = 'Ovidot123';

    findOneStub.returns({
      reset: token,
      resetExp: new Date(Date.now() + 1800000),
      save: sinon.stub().resolves()
    });

    const res = await request(app)
      .post(`/api/v1/reset-password/${token}`)
      .send({ password });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Password changed');
  });
});
