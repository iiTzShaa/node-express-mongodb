const request = require('supertest');
const app = require('../app'); // Correct path to your Express app

describe('GET /test', () => {
  it('should return a success message', async () => {
    const res = await request(app).get('/test');
    
    expect(res.status).toBe(200); // Expect status 200
    expect(res.body.message).toBe('Test successful'); // Check for the success message
  });
});
