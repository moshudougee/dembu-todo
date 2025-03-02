import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";

// Convert `import.meta.url` to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const dbPath = path.join(__dirname, "db.json"); // Adjust path if needed
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

// Middleware for CORS (optional)
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

server.use(middlewares);
server.use(router);

// Vercel expects an async function export
export default async function handler(req, res) {
  server(req, res);
}
