const db = require("../config/db");
const bcrypt = require("bcrypt");

// Create User
exports.createUser = async (req, res) => {
  const { employeeId, username, password } = req.body;

  if (!employeeId || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if employee exists
    const [employee] = await db.promise().query(
      "SELECT * FROM Staffs WHERE employeeId = ?",
      [employeeId]
    );

    if (employee.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if username already exists
    const [usernameCheck] = await db.promise().query(
      "SELECT * FROM Users WHERE username = ?",
      [username]
    );

    if (usernameCheck.length !== 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if user already exists for this employee
    const [userCheck] = await db.promise().query(
      "SELECT * FROM Users WHERE employeeId = ?",
      [employeeId]
    );

    if (userCheck.length !== 0) {
      return res.status(400).json({ message: "User already exists for this employee" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await db.promise().query(
      "INSERT INTO Users (employeeId, username, password) VALUES (?, ?, ?)",
      [employeeId, username, hashedPassword]
    );

    return res.status(201).json({
      message: "User created successfully",
      id: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while creating user",
      error: error.message,
    });
  }
};

// Get All Users
exports.getAll = (req, res) => {
  db.query(
    `SELECT u.*, s.firstName, s.lastName 
     FROM Users u 
     JOIN Staffs s ON u.employeeId = s.employeeId`,
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while fetching users",
          error: error.message,
        });
      }

      return res.status(200).json(result);
    }
  );
};

// Get User by ID
exports.getById = (req, res) => {
  const userId = req.params.id;

  db.query(
    `SELECT u.*, s.firstName, s.lastName 
     FROM Users u 
     JOIN Staffs s ON u.employeeId = s.employeeId
     WHERE u.userId = ?`,
    [userId],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while fetching user",
          error: error.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't return password
      const user = result[0];
      delete user.password;

      return res.status(200).json(user);
    }
  );
};

// Update User
exports.updateById = async (req, res) => {
  const userId = req.params.id;
  const { username, password } = req.body;

  if (!username && !password) {
    return res.status(400).json({ message: "At least one field (username or password) is required" });
  }

  try {
    // Check if user exists
    const [user] = await db.promise().query(
      "SELECT * FROM Users WHERE userId = ?",
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    let updateFields = {};
    let updateQuery = "UPDATE Users SET ";
    let queryParams = [];

    if (username) {
      // Check if new username already exists
      const [usernameCheck] = await db.promise().query(
        "SELECT * FROM Users WHERE username = ? AND userId != ?",
        [username, userId]
      );

      if (usernameCheck.length !== 0) {
        return res.status(400).json({ message: "Username already exists" });
      }

      updateFields.username = username;
      updateQuery += "username = ?, ";
      queryParams.push(username);
    }

    if (password) {
      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
      updateQuery += "password = ?, ";
      queryParams.push(hashedPassword);
    }

    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += " WHERE userId = ?";
    queryParams.push(userId);

    // Update user
    const [result] = await db.promise().query(updateQuery, queryParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while updating user",
      error: error.message,
    });
  }
};

// Delete User
exports.deleteById = (req, res) => {
  const userId = req.params.id;

  db.query(
    "DELETE FROM Users WHERE userId = ?",
    [userId],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while deleting user",
          error: error.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User deleted successfully" });
    }
  );
};