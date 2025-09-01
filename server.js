const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 測試用根路由
app.get("/", (req, res) => {
  res.json({
    message: "Marriage Assistant API",
    status: "running",
    endpoints: [
      "GET /api/surprise"
    ]
  });
});

// 範例 API
app.get("/api/surprise", (req, res) => {
  const ideas = [
    "Buy flowers 💐",
    "Cook a dinner 🍳",
    "Write a love note 💌",
    "Plan a weekend trip 🌍"
  ];
  const random = ideas[Math.floor(Math.random() * ideas.length)];
  res.json({ surprise: random });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
