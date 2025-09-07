const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

// 測試首頁
app.get("/", (req, res) => {
  res.send(`
    <h1>💍 Marriage Assistant API</h1>
    <p>✅ Service is running on Render.</p>
    <p>Try the API endpoints like:</p>
    <ul>
      <li>POST /api/register</li>
      <li>POST /api/bind-partner</li>
      <li>POST /api/add-diary</li>
      <li>GET /api/get-diaries/:userId</li>
      <li>POST /api/add-anniversary</li>
      <li>POST /api/add-task</li>
      <li>POST /api/generate-challenge</li>
      <li>POST /api/complete-challenge</li>
      <li>GET /api/leaderboard</li>
    </ul>
  `);
});

// 1️⃣ 註冊
app.post("/api/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  res.json({ message: "User registered successfully", user: { email } });
});

// 2️⃣ 綁定伴侶
app.post("/api/bind-partner", (req, res) => {
  const { userId, partnerId } = req.body;
  res.json({ message: `User ${userId} bound to partner ${partnerId}` });
});

// 3️⃣ 新增日記
app.post("/api/add-diary", (req, res) => {
  const { userId, content } = req.body;
  res.json({ message: "Diary added successfully", diary: { userId, content } });
});

// 4️⃣ 取得日記
app.get("/api/get-diaries/:userId", (req, res) => {
  const { userId } = req.params;
  res.json({
    message: "Fetched diaries",
    userId,
    diaries: ["Diary 1", "Diary 2"]
  });
});

// 5️⃣ 新增紀念日
app.post("/api/add-anniversary", (req, res) => {
  const { userId, date, title } = req.body;
  res.json({ message: "Anniversary added", anniversary: { userId, date, title } });
});

// 6️⃣ 新增任務
app.post("/api/add-task", (req, res) => {
  const { userId, task } = req.body;
  res.json({ message: "Task added", task: { userId, task } });
});

// 7️⃣ 生成挑戰
app.post("/api/generate-challenge", (req, res) => {
  res.json({
    message: "Challenge generated",
    challenge: "Say 3 nice things to your partner today ❤️"
  });
});

// 8️⃣ 完成挑戰
app.post("/api/complete-challenge", (req, res) => {
  const { userId, challengeId } = req.body;
  res.json({ message: `User ${userId} completed challenge ${challengeId}` });
});

// 9️⃣ 排行榜
app.get("/api/leaderboard", (req, res) => {
  res.json({
    leaderboard: [
      { user: "Alice", points: 120 },
      { user: "Bob", points: 90 }
    ]
  });
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
