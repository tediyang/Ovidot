import request from 'supertest';
import { expect } from 'chai';
import app from '../../../app.js';
import sinon from 'sinon';
import dotenv from 'dotenv';
import Cycle from '../../models/cycle.model.js';
dotenv.config();

const token = process.env.TEST_TOKEN;

describe('POST /cycles/create', () => {
  it('should return 400 when startdate is invalid', async () => {
    // Use fakeTimer to set Time
    const clock = sinon.useFakeTimers(new Date('2023-11-26').getTime());

    const res = await request(app)
      .post('/api/v1/auth/cycles/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        period: 4,
        startdate: '2023-11-21'
      });

    // Restore Time
    clock.restore();

    expect(res.statusCode).to.equal(400);
    expect(res.body).to.have.property("message", 'Specify a proper date: Date should not be less than 3 days or greater than present day');
  });

  it('should return 400 error when no data is provided', async () => {
    const res = await request(app)
      .post('/api/v1/auth/cycles/create')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).to.equal(400);
    expect(res.body).to.have.property("message", "Fill required properties");
  });

  it.skip('should create a new cycle with ovulation date provided', async () => {
    // Use fakeTimer to set Time
    const clock = sinon.useFakeTimers(new Date('2023-11-26').getTime());

    const res = await request(app)
      .post('/api/v1/auth/cycles/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        period: 4,
        startdate: '2023-11-26',
        ovulation: '2023-12-10'
      });

    // Restore Time
    clock.restore();

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property("message", "Cycle created");
    expect(res.body).to.have.property("cycleId");
  });

  it('returns 400 when user creates another cycle in a month below the required days', async () => {
    // Use fakeTimer to set Time
    const clock = sinon.useFakeTimers(new Date('2023-12-05').getTime());

    const res = await request(app)
      .post('/api/v1/auth/cycles/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        period: 4,
        startdate: '2023-12-05'
      });

    // Restore Time
    clock.restore();

    expect(res.statusCode).to.equal(400);
    expect(res.body).to.have.property("message", "Cycle already exist for this month: Delete to create another");
  });

  it.skip('should create a new cycle for the next month >= next date', async () => {
    // Use fakeTimer to set Time
    const clock = sinon.useFakeTimers(new Date('2023-12-25').getTime());

    const res = await request(app)
      .post('/api/v1/auth/cycles/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        period: 4,
        startdate: '2023-12-25',
      });

    // Restore Time
    clock.restore();

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property("message", "Cycle created");
    expect(res.body).to.have.property("cycleId");
  });
});


describe('GET /cycles/getall', () => {
  it('should fetch all cycles', async () => {
    const res = await request(app)
      .get('/api/v1/auth/cycles/getall')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array').that.is.not.empty;
  });
});


describe('GET /cycles/:cycleId', () => {
  it('should fetch a specific cycle', async () => {
    const res = await request(app)
      .get('/api/v1/auth/cycles/65628a803cd58e95534a5547')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('ovulation');
    expect(res.body).to.have.property('period');
    expect(res.body).to.have.property('start_date');
  });

  it('should return 404 when no cycle is found', async () => {
    const res = await request(app)
      .get('/api/v1/auth/cycles/65628a803cd58e95534a5549')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(404);
    expect(res.body).to.have.property('message', 'Cycle not found');
  });
});


describe('GET /cycles/getall/:month', () => {
  it('should fetch all cycles for a specific month using number', async () => {
    const res = await request(app)
      .get('/api/v1/auth/cycles/getall/11')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array').that.is.not.empty;
  });

  it('should fetch all cycles for a specific month using string', async () => {
    const res = await request(app)
      .get('/api/v1/auth/cycles/getall/december')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array').that.is.not.empty;
  });
});


describe('PUT /cycles/:cycleId', () => {
  it('should return 400 when no data is provided', async () => {
    const res = await request(app)
      .put('/api/v1/auth/cycles/65628a803cd58e95534a5547')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).to.equal(400);
    expect(res.body).to.have.property("message", "Provide atleast a param to update: period or ovulation");
    });

  it('shoul return 400 when an invalid ovulation date is provided', async () => {
    const res = await request(app)
      .put('/api/v1/auth/cycles/65628a803cd58e95534a5547')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ovulation: '2023-11-21'
      });

    expect(res.statusCode).to.equal(400);
    expect(res.body).to.have.property("message", 'Ovulation date must not exceed 18 days from start date');
  });

  it('should update the cycle wih period given', async () => {
    const res = await request(app)
      .put('/api/v1/auth/cycles/65628a803cd58e95534a5547')
      .set('Authorization', `Bearer ${token}`)
      .send({
        period: 6
      });

    expect(res.statusCode).to.equal(200);
    expect(res.body.updated.period).to.equal(6)
    expect(res.body.updated.period_range).to.have.lengthOf(6);
  });

  it('should update the cycle with ovulation date given', async () => {
    const res = await request(app)
      .put('/api/v1/auth/cycles/65628a803cd58e95534a5547')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ovulation: '2023-12-11'
      });

    expect(res.statusCode).to.equal(200);
    expect(res.body.updated.ovulation).to.equal('2023-12-11T00:00:00.000Z');
  });
});


describe('DELETE /cycles/:cycleId', () => {
  it('should delete a cycle', async () => {
    // Mock Cycle.findByIdAndRemove
    sinon.stub(Cycle, 'findByIdAndRemove').resolves(true);

    const res = await request(app)
      .delete('/api/v1/auth/cycles/65628a803cd58e95534a5547')
      .set('Authorization', `Bearer ${token}`);

    // Restore Cycle.findByIdAndRemove
    Cycle.findByIdAndRemove.restore();

    expect(res.statusCode).to.equal(204);
  });
});
