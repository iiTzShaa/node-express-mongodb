module.exports = {
  testEnvironment: 'node', 
  setupFiles: ['dotenv/config'], 
  coverageDirectory: './coverage', 
  collectCoverageFrom: ['src/**/*.js'], 
  testMatch: ['**/__tests__/**/*.test.js'], 
};