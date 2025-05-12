const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = 'your-secret-key-here';
const JWT_EXPIRES_IN = '1d';

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Find user by username
    const [users] = await db.promise().query(
      `SELECT u.*, s.firstName, s.lastName, s.email 
       FROM Users u 
       JOIN Staffs s ON u.employeeId = s.employeeId 
       WHERE u.username = ?`,
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      { 
        userId: user.userId, 
        employeeId: user.employeeId,
        username: user.username,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // Don't send password back
    delete user.password;

    return res.status(200).json({
      message: "Login successful",
      user,
      token
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong during login",
      error: error.message
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: "Logout successful" });
};

exports.getCurrentUser = (req, res) => {
  // The auth middleware already attached the user to req.user
  return res.status(200).json(req.user);
};

// Add this to your existing userControllers.js
exports.getUserProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [users] = await db.promise().query(
      `SELECT u.userId, u.username, s.* 
       FROM Users u 
       JOIN Staffs s ON u.employeeId = s.employeeId 
       WHERE u.userId = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while fetching user profile",
      error: error.message
    });
  }
};