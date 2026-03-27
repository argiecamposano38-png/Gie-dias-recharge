import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock database
  const transactions: any[] = [];

  // API Routes
  app.get("/api/transactions", (req, res) => {
    res.json(transactions);
  });

  app.post("/api/topup", (req, res) => {
    const { userId, serverId, diamonds, price, paymentMethod } = req.body;
    
    if (!userId || !serverId || !diamonds || !price || !paymentMethod) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transaction = {
      id: `TXN-${Date.now()}`,
      userId,
      serverId,
      diamonds,
      price,
      paymentMethod,
      timestamp: new Date().toISOString(),
      status: "Success"
    };

    transactions.push(transaction);
    console.log("New Transaction:", transaction);
    
    res.status(201).json(transaction);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
