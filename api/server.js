import jsonServer from "json-server";
import { createServer } from "http";

const server = jsonServer.create();
const router = jsonServer.router("api/db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

export default function handler(req, res) {
  server(req, res);
}

if (process.env.NODE_ENV !== "production") {
  createServer(server).listen(5000, () => {
    console.log("JSON Server is running locally on port 5000");
  });
}

