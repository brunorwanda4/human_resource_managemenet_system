const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const department = require("./routes/department");
const post = require("./routes/post");
const staff = require("./routes/staff");
const user = require("./routes/user");
const recruitment = require("./routes/recruitment");
const auth = require("./routes/auth");

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend origin
  credentials: true, // Required when using withCredentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

const JWT_SECRET = "brunorwanda4@gmail.com1234><mukamana*&%#jnnfcjmmej)*242";

require("./config/db");

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

app.get("/", (req, res) => {
  res.status(200).json({ message: "Human Resource Management System API" });
});

// Use routes
app.use("/auth", auth);
app.use("/department", department);
app.use("/post", post);
app.use("/staff", staff);
app.use("/user", user);
app.use("/recruitment", recruitment);

app.listen(3008, () => console.log("Server is running on port 3008"));
