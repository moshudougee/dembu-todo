import jsonServer from 'json-server';
import { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';

const server = jsonServer.create();
const dbPath = path.join(process.cwd(), 'api', 'db.json'); // Use process.cwd() for dynamic path resolution
console.log('DB Path:', dbPath); // Log the DB path for debugging
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

// ✅ Rewrites API requests correctly
server.use(jsonServer.rewriter({
    '/api/*': '/$1'  // Removes `/api/` prefix so `/api/todos` → `/todos`
}));

server.use(middlewares);
server.use(router);

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Incoming Request:', req.method, req.url); // Log incoming requests
  return server(req, res);
}
