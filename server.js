const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");
const products = [
  { id: "p1", name: "Arc Desk Lamp", category: "Home", price: 129, rating: 4.8, stock: 18 },
  { id: "p2", name: "Transit Weekender", category: "Travel", price: 248, rating: 4.7, stock: 7 },
  { id: "p3", name: "Studio Headphones", category: "Tech", price: 319, rating: 4.9, stock: 22 },
  { id: "p4", name: "Brew Pro Kettle", category: "Kitchen", price: 156, rating: 4.6, stock: 4 },
  { id: "p5", name: "Ergo Work Chair", category: "Office", price: 699, rating: 4.5, stock: 11 },
  { id: "p6", name: "Ceramic Dinner Set", category: "Kitchen", price: 184, rating: 4.4, stock: 16 },
  { id: "p7", name: "Smart Fitness Watch", category: "Tech", price: 389, rating: 4.7, stock: 6 },
  { id: "p8", name: "Linen Throw Set", category: "Home", price: 96, rating: 4.3, stock: 28 }
];

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function startExpressServer() {
  try {
    const express = require("express");
    const app = express();

    app.use(express.json());
    app.use(express.static(publicDir));

    app.get("/api/products", (_req, res) => res.json(products));
    app.post("/api/orders", (req, res) => {
      const total = Number(req.body?.total || 0);
      res.status(201).json({
        number: `CP-${Math.floor(1000 + Math.random() * 9000)}`,
        total,
        status: "Confirmed"
      });
    });
    app.get("*", (_req, res) => res.sendFile(path.join(publicDir, "index.html")));

    app.listen(PORT, () => {
      console.log(`E-Commerce Business Website running with Express at http://localhost:${PORT}`);
    });
    return true;
  } catch (error) {
    return false;
  }
}

function resolveFile(urlPath) {
  const safePath = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = safePath === "/" ? "/index.html" : safePath;
  return path.join(publicDir, requestedPath);
}

function startStaticServer() {
  const server = http.createServer((req, res) => {
  if (!["GET", "HEAD"].includes(req.method)) {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method not allowed");
    return;
  }

  const filePath = resolveFile(new URL(req.url, `http://${req.headers.host}`).pathname);

  fs.readFile(filePath, (error, content) => {
    if (error) {
      fs.readFile(path.join(publicDir, "index.html"), (fallbackError, fallback) => {
        if (fallbackError) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Not found");
          return;
        }
        res.writeHead(200, { "Content-Type": mimeTypes[".html"] });
        res.end(fallback);
      });
      return;
    }

    res.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream"
    });
    res.end(req.method === "HEAD" ? undefined : content);
  });
  });

  server.listen(PORT, () => {
    console.log(`E-Commerce Business Website running at http://localhost:${PORT}`);
  });
}

if (!startExpressServer()) {
  startStaticServer();
}
