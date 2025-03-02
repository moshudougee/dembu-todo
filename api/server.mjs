import jsonServer from "json-server";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Convert `import.meta.url` to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const dbPath = path.join(__dirname, "db.json"); // Adjust path if needed

const readDB = () => {
  try {
      const data = fs.readFileSync(dbPath);
      return JSON.parse(data);
  } catch (error) {
      throw new Error('Error reading database file' + error);
  }
};

const writeDB = (data) => {
  try {
     fs.writeFileSync(dbPath, JSON.stringify(data, null, 2)); 
  } catch (error) {
     throw new Error('Error writing to database file' + error); 
  }
};



//const router = jsonServer.router(dbPath); // Use this for read-only JSON files
const middlewares = jsonServer.defaults();

// ✅ Rewrites API requests correctly
/**server.use(jsonServer.rewriter({
  '/api/*': '/$1'  // Removes `/api/` prefix so `/api/todos` → `/todos`
}));**/

server.get('/api/todos', async (req, res) => {
  try {
      const db = readDB();
      const todos = db.todos;
      res.json(todos);
  } catch (error) {
      console.error('Error fetching todos:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
})

server.post('/api/todos', async (req, res) => {
  try {
      const db = readDB();
      const newTodo = req.body;
      db.todos.push(newTodo);
      writeDB(db);
      res.status(201).json(newTodo);
  } catch (error) {
      console.error('Error adding todo:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
})

server.use(middlewares);

// Vercel expects an async function export
export default async function handler(req, res) {
  server(req, res);
}
