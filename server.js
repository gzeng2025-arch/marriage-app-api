const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔹 連接 MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/marriage_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// 🔹 建立 Schema & Models
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
});

const diarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  date: { type: Date, default: Date.now }
});

const anniversarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  date: Date
});

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  task: String,
  completed: { type: Boolean, default: false }
});

const challengeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  challenge: String,
  completed: { type: Boolean, default: false }
});

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  score: { type: Number, default: 0 }
});

const User = mongoose.model("User", userSchema);
const Diary = mongoose.model("Diary", diarySchema);
const Anniversary = mongoose.model("Anniversary", anniversarySchema);
const Task = mongoose.model("Task", taskSchema);
const Challenge = mongoose.model("Challenge", challengeSchema);
const Score = mongoose.model("Score", scoreSchema);

// 🔹 Root API
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

// 🔹 註冊使用者
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  const newUser = new User({ email, password });
  await newUser.save();
  res.json({ message: "User registered successfully", userId: newUser._id });
});

// 🔹 綁定伴侶
app.post("/api/bind-partner", async (req, res) => {
  const { userId, partnerId } = req.body;
  const user = await User.findById(userId);
  const partner = await User.findById(partnerId);

  if (!user || !partner) {
    return res.status(400).json({ error: "User or partner not found" });
  }

  user.partnerId = partnerId;
  partner.partnerId = userId;
  await user.save();
  await partner.save();

  res.json({ message: "Users successfully bound as partners" });
});

// 🔹 新增日記
app.post("/api/add-diary", async (req, res) => {
  const { userId, content } = req.body;
  const diary = new Diary({ userId, content });
  await diary.save();
  res.json({ message: "Diary added", diary });
});

// 🔹 查詢日記
app.get("/api/get-diaries/:userId", async (req, res) => {
  const diaries = await Diary.find({ userId: req.params.userId });
  res.json(diaries);
});

// 🔹 新增紀念日
app.post("/api/add-anniversary", async (req, res) => {
  const { userId, title, date } = req.body;
  const anniversary = new Anniversary({ userId, title, date });
  await anniversary.save();
  res.json({ message: "Anniversary added", anniversary });
});

// 🔹 新增任務
app.post("/api/add-task", async (req, res) => {
  const { userId, task } = req.body;
  const newTask = new Task({ userId, task });
  await newTask.save();
  res.json({ message: "Task added", task: newTask });
});

// 🔹 生成挑戰
app.post("/api/generate-challenge", async (req, res) => {
  const { userId } = req.body;
  const challengeList = [
    "Give your partner a hug",
    "Write a love note",
    "Cook dinner together",
    "Say thank you today",
    "Plan a future trip"
  ];
  const random = challengeList[Math.floor(Math.random() * challengeList.length)];
  const challenge = new Challenge({ userId, challenge: random });
  await challenge.save();
  res.json({ message: "Challenge generated", challenge });
});

// 🔹 完成挑戰
app.post("/api/complete-challenge", async (req, res) => {
  const { userId, challengeId } = req.body;
  const challenge = await Challenge.findOne({ _id: challengeId, userId });

  if (!challenge) return res.status(404).json({ error: "Challenge not found" });

  challenge.completed = true;
  await challenge.save();

  let score = await Score.findOne({ userId });
  if (!score) {
    score = new Score({ userId, score: 0 });
  }
  score.score += 10;
  await score.save();

  res.json({ message: "Challenge completed", challenge, score: score.score });
});

// 🔹 排行榜
app.get("/api/leaderboard", async (req, res) => {
  const leaderboard = await Score.find()
    .populate("userId", "email")
    .sort({ score: -1 });

  res.json(leaderboard);
});

// 🔹 啟動伺服器
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
