const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // Adjust this to match your app's path
const User = require('../models/userModel'); // Adjust this to match your user model's path

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

describe('POST /signup', () => {
  let userData;

  beforeAll(() => {
    userData = {
      name: 'Test User',
      email: 'testuser12@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };
  });

  
  it('should sign up a new user and return a token', async () => {
    const res = await request(app)
      .post('/api/v1/users/signup')
      .send(userData);

    expect(res.status).toBe(201); 
    expect(res.body.status).toBe('success');
    expect(res.body.data.user).toHaveProperty('_id');
    expect(res.body.token).toBeDefined();

    const user = await User.findOne({ email: userData.email });
    expect(user).not.toBeNull();
    expect(user.name).toBe(userData.name);
  }, 60000); 

  
  it('should return an error if the email already exists', async () => {
    
    const res = await request(app)
      .post('/api/v1/users/signup')
      .send(userData);

    
    expect(res.status).toBe(500); 
     
  }, 60000); 
});
