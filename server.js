const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔹 MongoDB connection (Render 會用環境變數)
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/marriageApp";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🔹 Example Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
});

const User = mongoose.model("User", userSchema);

// ================== Routes ==================

// Root API
app.get("/", (req, res) => {
  res.send(`
    <h1>💍 Marriage Assistant API</h1>
    <p>Service is running on Render.</p>
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

// ================== API ==================

// 註冊使用者
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = new User({ email, password });
    await newUser.save();
    res.json({ message: "User registered successfully", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

// 綁定伴侶
app.post("/api/bind-partner", async (req, res) => {
  try {
    const { userId, partnerId } = req.body;

    const user = await User.findById(userId);
    const partner = await User.findById(partnerId);

    if (!user || !partner) {
      return res.status(400).json({ error: "User or partner not found" });
    }

    user.partnerId = partner._id;
    partner.partnerId = user._id;

    await user.save();
    await partner.save();

    res.json({ message: "Users successfully bound as partners" });
  } catch (err) {
    res.status(500).json({ error: "Failed to bind partner" });
  }
});

// ================== Server ==================
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
erver running on port ${port}`));
