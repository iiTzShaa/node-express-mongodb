const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // Adjust this to match your app's path
const User = require('../models/userModel'); // Adjust this to match your user model's path
const jwt = require('jsonwebtoken');

let mongoServer;

const signToken = id =>{
    return  jwt.sign({id}, process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN });
}
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

describe('GET /protected-route', () => {
  it('should return a protected resource with a valid token', async () => {
  
  
    const user = await User.create({
        name: 'Test User',
        email: 'testuser12@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
    });
    const token = signToken(user._id); 

    const res = await request(app)
      .get('/api/v1/tours')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
   
  });

  it('should return an error if no token is provided', async () => {
    const res = await request(app).get('/api/v1/tours');  
  
    expect(res.status).toBe(401);
  }, 60000);





});