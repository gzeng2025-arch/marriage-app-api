const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ====== 模擬數據庫 ======
let users = []; // 保存註冊的用戶

// ====== 根路由 ======
app.get("/", (req, res) => {
  res.json({
    message: "Marriage Assistant API",
    status: "running",
    endpoints: [
      "POST /api/register",
      "POST /api/bind-partner"
    ]
  });
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
