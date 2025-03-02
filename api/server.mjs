import jsonServer from "json-server";
import { Redis }from "redis";
import dotenv from "dotenv";
dotenv.config();

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const redis = new Redis(process.env.REDIS_URL); // Connect to Upstash Redis

server.use(middlewares);

// 🚀 Custom Middleware: Load JSON data from Redis
server.use(async (req, res, next) => {
  try {
    const data = await redis.get("db");
    req.db = data ? JSON.parse(data) : {}; // Load Redis data as JSON
  } catch (error) {
    console.error("Redis Error:", error);
    req.db = {};
  }
  next();
});

// 🚀 Custom Router: Read from Redis instead of `db.json`
const router = jsonServer.router(() => req.db);
server.use(router);

// 🚀 Save to Redis on POST, PATCH, DELETE requests
server.use(async (req, res, next) => {
  if (["POST", "PATCH", "DELETE"].includes(req.method)) {
    try {
      const dbData = router.db.getState(); // Get current DB state
      await redis.set("db", JSON.stringify(dbData)); // Save to Redis
    } catch (error) {
      console.error("Redis Write Error:", error);
    }
  }
  next();
});

// ✅ Export for Vercel
export default async function handler(req, res) {
  server(req, res);
}
