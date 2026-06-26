const serverless = require('serverless-http');
const app = require('../src/app');

// Ekspor sebagai handler fungsi serverless Netlify
module.exports.handler = serverless(app);
