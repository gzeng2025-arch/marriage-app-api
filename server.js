const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 模擬資料存放（正式環境應改用資料庫）
let users = [];
let diaries = [];
let anniversaries = [];
let tasks = [];
let challenges = [];
let scores = {};

// 根路由
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

// 註冊
app.post("/api/register", (req, res) => {
  const { email, password } = req.body;
  const id = uuidv4();
  users.push({ id, email, password, partnerId: null });
  res.json({ message: "User registered successfully", userId: id });
});

// 綁定伴侶
app.post("/api/bind-partner", (req, res) => {
  const { userId, partnerId } = req.body;
  const user = users.find((u) => u.id === userId);
  const partner = users.find((u) => u.id === partnerId);

  if (!user || !partner) {
    return res.status(400).json({ error: "User or partner not found" });
  }

  user.partnerId = partnerId;
  partner.partnerId = userId;
  res.json({ message: "Users successfully bound as partners" });
});

// 新增日記
app.post("/api/add-diary", (req, res) => {
  const { userId, content } = req.body;
  const diary = { id: uuidv4(), userId, content, date: new Date() };
  diaries.push(diary);
  res.json({ message: "Diary added", diary });
});

// 查詢日記
app.get("/api/get-diaries/:userId", (req, res) => {
  const { userId } = req.params;
  const userDiaries = diaries.filter((d) => d.userId === userId);
  res.json(userDiaries);
});

// 新增紀念日
app.post("/api/add-anniversary", (req, res) => {
  const { userId, title, date } = req.body;
  const anniversary = { id: uuidv4(), userId, title, date };
  anniversaries.push(anniversary);
  res.json({ message: "Anniversary added", anniversary });
});

// 新增任務
app.post("/api/add-task", (req, res) => {
  const { userId, task } = req.body;
  const newTask = { id: uuidv4(), userId, task, completed: false };
  tasks.push(newTask);
  res.json({ message: "Task added", newTask });
});

// 生成挑戰
app.post("/api/generate-challenge", (req, res) => {
  const { userId } = req.body;
  const challengeList = [
    "Give your partner a hug",
    "Write a love note",
    "Cook dinner together",
    "Say thank you today",
    "Plan a future trip",
  ];
  const random = challengeList[Math.floor(Math.random() * challengeList.length)];
  const challenge = { id: uuidv4(), userId, challenge: random, completed: false };
  challenges.push(challenge);
  res.json({ message: "Challenge generated", challenge });
});

// 完成挑戰
app.post("/api/complete-challenge", (req, res) => {
  const { challengeId, userId } = req.body;
  const challenge = challenges.find((c) => c.id === challengeId && c.userId === userId);

  if (!challenge) return res.status(404).json({ error: "Challenge not found" });

  challenge.completed = true;
  scores[userId] = (scores[userId] || 0) + 10; // 完成一次 +10 分
  res.json({ message: "Challenge completed", challenge });
});

// 排行榜
app.get("/api/leaderboard", (req, res) => {
  const leaderboard = Object.entries(scores)
    .map(([userId, score]) => {
      const user = users.find((u) => u.id === userId);
      return { user: user ? user.email : "Unknown", score };
    })
    .sort((a, b) => b.score - a.score);

  res.json(leaderboard);
});

// 啟動伺服器
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

