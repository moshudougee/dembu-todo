const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const dbPath = path.join(__dirname, 'db.json'); // Adjust path if needed
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

// Middleware for CORS (optional, but useful)
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

server.use(middlewares);
server.use(router);

module.exports = server;
