const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const server = require('../app'); // Your Express app

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.DATABASE = mongoUri;
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Tour Model', () => {
  
  it('should create a tour with valid data', async () => {
    const validTourData = {
      name: "Amazing Safari Adventure", // At least 10 characters
      duration: 7,
      maxGroupSize: 15,
      difficulty: "medium", // Required field
      price: 1500,
      ratingAverage: 4.7,
      ratingsQuantity: 100,
      description: "Experience the wild!",
      summary: "The ultimate safari experience.",
      imageCover: "safari-cover.jpg",
      startDates: ["2024-06-01", "2024-08-15"]
    };

    const response = await request(server)
      .post('/api/v1/tours')
      .send(validTourData)
      .expect(201);

    expect(response.body.status).toBe('success');
    expect(response.body.data.tour.name).toBe(validTourData.name);
    expect(response.body.data.tour.price).toBe(validTourData.price);
    expect(response.body.data.tour.difficulty).toBe(validTourData.difficulty);
  });



  it('should fail to create a tour with invalid data', async () => {
    const invalidTourData = {
      name: "Short", 
      duration: 7,
      maxGroupSize: 15,
      difficulty: "medium",
      price: 1500,
      ratingAverage: 4.5,
      ratingsQuantity: 100,
      description: "Invalid tour with too short name",
      summary: "Invalid data case",
      imageCover: "invalid-cover.jpg",
      startDates: ["2024-06-01"]
    };

    const response = await request(server)
      .post('/api/v1/tours')
      .send(invalidTourData)
      .expect(500);

    expect(response.body.status).toBe('error');
  });

  it('should fail if discount price is greater than regular price', async () => {
    const invalidTourData = {
      name: "Tour with Invalid Discount",
      duration: 5,
      maxGroupSize: 10,
      difficulty: "medium",
      price: 1000,
      priceDiscount: 1200, 
      ratingAverage: 4.5,
      ratingsQuantity: 30,
      description: "Tour with an invalid discount",
      summary: "Price discount is greater than regular price",
      imageCover: "cover.jpg",
      startDates: ["2024-07-01"]
    };

    const response = await request(server)
      .post('/api/v1/tours')
      .send(invalidTourData)
      .expect(500);

    expect(response.body.status).toBe('error');
  });

});
