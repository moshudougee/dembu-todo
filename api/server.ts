import jsonServer from 'json-server';
import { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// ✅ Rewrites API requests correctly
server.use(jsonServer.rewriter({
    '/api/*': '/$1'  // Removes `/api/` prefix so `/api/todos` → `/todos`
}));

server.use(middlewares);
server.use(router);

export default function handler(req: VercelRequest, res: VercelResponse) {
  return server(req, res);
}
