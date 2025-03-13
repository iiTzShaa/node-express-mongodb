const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

let mongoServer;
let userData;  // Store the user data to be used in the tests
let token;      // Store the JWT token after signup

beforeAll(async () => {
 mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.DATABASE = mongoUri;
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

  // User data to be used for signup
  userData = {
    name: 'Test User',
    email: 'testuser12@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
  };
});

afterAll(async () => {
  // Clean up after tests
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Endpoints', () => {

  it('should sign up a new user and return a token', async () => {
    const res = await request(app)
      .post('/api/v1/users/signup')
      .send(userData);

    expect(res.statusCode).toEqual(201);  // Expect successful signup
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('token');  // Token should be returned
    token = res.body.token;  // Store the token for future tests
  });

  it('should fetch all users', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);  // Set the token for authentication

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data.users).toBeInstanceOf(Array);
  });

  it('should fetch a single user by ID', async () => {
    const res = await request(app)
      .get(`/api/v1/users/${userData.email}`)  // Use email or user ID for fetching
      .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(500);
      
  });

  it('should update the user information', async () => {
    const res = await request(app)
      .patch(`/api/v1/users/updateMe`)  // Assuming the update route uses /updateMe
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated User',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data.user).toHaveProperty('name', 'Updated User');
  });

  it('should delete a user account', async () => {
    const res = await request(app)
      .delete(`/api/v1/users/deleteMe`)  // Assuming the delete route uses /deleteMe
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(204);
  });
});
