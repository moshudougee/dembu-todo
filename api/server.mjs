//@ts-checkimport jsonServer from "json-server";
import express from "express";
import cors from "cors";
import { createClient } from "redis";
import dotenv from "dotenv";
import { randomUUID } from "crypto";
dotenv.config();

const server = express();
server.use(express.json());

server.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));

const redis = createClient({url: process.env.REDIS_URL});
//console.log("Redis URL:", process.env.REDIS_URL);
redis.on("error", (err) => console.error("Redis Client Error", err));
await redis.connect();



server.get('/api/todos', async (req, res) => {
  try {
    const todos = await redis.get("todos");
    res.json(JSON.parse(todos || "[]"));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
})

server.post('/api/todos', async (req, res) => {
  try {
    const newTodo = {id: randomUUID(), ...req.body};
    let todos = JSON.parse(await redis.get("todos") || "[]");
    todos.push(newTodo);
    await redis.set("todos", JSON.stringify(todos));
    res.json(newTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to save todo" });
  }
})

server.patch("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTodo = req.body;
    let todos = JSON.parse(await redis.get("todos") || "[]");

    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return res.status(404).json({ error: "Todo not found" });

    todos[index] = { ...todos[index], ...updatedTodo };
    await redis.set("todos", JSON.stringify(todos));
    res.json(todos[index]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

server.delete("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let todos = JSON.parse(await redis.get("todos") || "[]");

    todos = todos.filter(todo => todo.id !== id);
    await redis.set("todos", JSON.stringify(todos));
    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// Centralized Error Handling Middleware
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

server.listen(5000, () => {
  console.log('Server is running');
});

// ✅ Export for Vercel
export default server;
