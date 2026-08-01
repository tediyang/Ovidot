const express = require('express');
const request = require('supertest');
const { expect } = require('chai');
const rateLimit = require('express-rate-limit');


const buildApp = (max) => {
  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max,
    message: { message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const app = express();
  app.use(express.json());
  app.post('/auth', limiter, (req, res) => res.status(200).json({ message: 'ok' }));
  app.get('/token', limiter, (req, res) => res.status(200).json({ message: 'ok' }));
  app.get('/api', limiter, (req, res) => res.status(200).json({ message: 'ok' }));
  return app;
};


describe('RATE LIMITER MIDDLEWARE', () => {
  describe('authLimiter (max: 5)', () => {
    let testApp;

    before(() => {
      testApp = buildApp(5);
    });

    it('should allow requests within the limit', async () => {
      for (let i = 0; i < 5; i++) {
        const res = await request(testApp).post('/auth').send({});
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'ok');
      }
    });

    it('should return 429 when the limit is exceeded', async () => {
      const res = await request(testApp).post('/auth').send({});
      expect(res.status).to.equal(429);
      expect(res.body).to.have.property('message', 'Too many requests, please try again later.');
    });

    it('should include rate limit headers in the response', async () => {
      const res = await request(testApp).post('/auth').send({});
      expect(res.headers).to.have.property('ratelimit-limit');
      expect(res.headers).to.have.property('ratelimit-remaining');
    });
  });

  describe('tokenLimiter (max: 10)', () => {
    let testApp;

    before(() => {
      testApp = buildApp(10);
    });

    it('should allow requests within the limit', async () => {
      for (let i = 0; i < 10; i++) {
        const res = await request(testApp).get('/token');
        expect(res.status).to.equal(200);
      }
    });

    it('should return 429 when the limit is exceeded', async () => {
      const res = await request(testApp).get('/token');
      expect(res.status).to.equal(429);
      expect(res.body).to.have.property('message', 'Too many requests, please try again later.');
    });
  });

  describe('apiLimiter (max: 100)', () => {
    let testApp;

    before(() => {
      testApp = buildApp(100);
    });

    it('should allow requests within the limit', async () => {
      for (let i = 0; i < 100; i++) {
        const res = await request(testApp).get('/api');
        expect(res.status).to.equal(200);
      }
    });

    it('should return 429 when the limit is exceeded', async () => {
      const res = await request(testApp).get('/api');
      expect(res.status).to.equal(429);
      expect(res.body).to.have.property('message', 'Too many requests, please try again later.');
    });
  });

  describe('Rate limit skips in test environment', () => {
    it('should skip rate limiting when ENVIR is test', async () => {
      const originalEnvir = process.env.ENVIR;
      process.env.ENVIR = 'test';

      const { authLimiter } = require('../../../middleware/rateLimiter.js');
      const app = express();
      app.use(express.json());
      app.post('/login', authLimiter, (req, res) => res.status(200).json({ message: 'ok' }));

      // Make more requests than the production limit without being blocked
      for (let i = 0; i < 10; i++) {
        const res = await request(app).post('/login').send({});
        expect(res.status).to.equal(200);
      }

      process.env.ENVIR = originalEnvir;
    });
  });
});
