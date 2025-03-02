const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("api/db.json"); // Ensure db.json exists
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

module.exports = (req, res) => {
  server(req, res);
};
