import { expect } from 'chai';
import app from '../../../app.js';
import mongoose from 'mongoose';
import request from 'supertest';


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
