import jsonServer from 'json-server';
import { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const dbPath = path.join(__dirname, 'db.json'); // Use __dirname for dynamic path resolution
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

// ✅ Rewrites API requests correctly
server.use(jsonServer.rewriter({
    '/api/*': '/$1'  // Removes `/api/` prefix so `/api/todos` → `/todos`
}));

server.use(middlewares);
server.use(router);

export const handler = (req: VercelRequest, res: VercelResponse) => {
  return server(req, res);
};
