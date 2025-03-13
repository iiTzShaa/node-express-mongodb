const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); 
const User = require('../models/userModel'); 
const bcrypt = require('bcryptjs'); 

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.DATABASE = mongoUri;
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
 
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('POST /login', () => {

  it('should log in with valid credentials and return a token', async () => {
    const userData = {
      email: 'testuser@example.com',
      password: 'password123',
      passwordConfirm: 'password123', 
    };
  
    await User.create({
      name: 'Test User',
      email: userData.email,
      password: userData.password,  
      passwordConfirm: userData.passwordConfirm, 
    });
  
    const res = await request(app)
      .post('/api/v1/users/login') 
      .send({
        email: userData.email,
        password: userData.password,
      });
    
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  }); 

  it('should return an error if the email is not found', async () => {
    const userData = {
        email: 'nonexistentuser@example.com',
        password: 'password123',
        passwordConfirm: 'password123', 
    };

    const res = await request(app)
        .post('/api/v1/users/login')
        .send({
            email: userData.email,
            password: userData.password,
        });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Incorrect email or password'); 
});

it('should return an error if the password is incorrect', async () => {

  const res = await request(app)
    .post('/api/v1/users/login')
    .send({
      email: 'testuser@example.com',
      password: 'wrongpassword',
    });

  expect(res.status).toBe(401);
  expect(res.body.message).toBe('Incorrect email or password');
});

});
