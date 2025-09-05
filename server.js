const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Root API (Homepage)
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Marriage Assistant API</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #4CAF50; }
          p { font-size: 18px; }
          code { background: #f4f4f4; padding: 4px 6px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1>💍 Marriage Assistant API</h1>
        <p>✅ Service is running on Render.</p>
        <p>Try the API endpoints like:</p>
        <ul style="text-align:left; display:inline-block;">
          <li><code>POST /api/register</code></li>
          <li><code>POST /api/bind-partner</code></li>
          <li><code>POST /api/add-diary</code></li>
          <li><code>GET /api/get-diaries/:userId</code></li>
          <li><code>POST /api/add-anniversary</code></li>
          <li><code>POST /api/add-task</code></li>
          <li><code>POST /api/generate-challenge</code></li>
          <li><code>POST /api/complete-challenge</code></li>
          <li><code>GET /api/leaderboard</code></li>
        </ul>
      </body>
    </html>
  `);
});



// ====== 註冊用戶 ======
app.post("/api/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const id = uuidv4();
  users.push({ id, email, password, partnerId: null });

  res.json({ message: "User registered successfully", userId: id });
});

// ====== 綁定伴侶 ======
app.post("/api/bind-partner", (req, res) => {
  const { userId, partnerId } = req.body;

  const user = users.find(u => u.id === userId);
  const partner = users.find(u => u.id === partnerId);

  if (!user || !partner) {
    return res.status(400).json({ error: "User or partner not found" });
  }

  user.partnerId = partnerId;
  partner.partnerId = userId;

  res.json({ message: "Users successfully bound as partners" });
});

// ====== 啟動服務 ======
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
