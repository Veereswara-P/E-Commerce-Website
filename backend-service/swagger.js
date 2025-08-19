const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'MarketPlace E-Commerce API',
    description: 'API documentation for the full-stack e-commerce application.',
  },
  // --- CHANGE THESE FOR LOCAL DEVELOPMENT ---
  host: ['e-commerce-backend-721810542467.asia-south2.run.app'],      // Your local host and port
  schemes: ['http','https'],            // Use http for local testing
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js']; 

swaggerAutogen(outputFile, endpointsFiles, doc);