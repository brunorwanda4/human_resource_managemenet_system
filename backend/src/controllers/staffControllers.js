const db = require("../config/db");

// Create Staff
exports.createStaff = (req, res) => {
  const {
    postId,
    depId,
    firstName,
    lastName,
    gender,
    DOB,
    email,
    phone,
    address
  } = req.body;

  // Validate required fields
  if (!postId || !depId || !firstName || !lastName || !gender || !DOB || !email || !phone || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if email already exists
  db.query(
    "SELECT * FROM Staffs WHERE email = ?",
    [email],
    (emailError, emailResult) => {
      if (emailError) {
        return res.status(500).json({
          message: "Something went wrong while checking email",
          error: emailError.message,
        });
      }

      if (emailResult.length !== 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Check if phone already exists
      db.query(
        "SELECT * FROM Staffs WHERE phone = ?",
        [phone],
        (phoneError, phoneResult) => {
          if (phoneError) {
            return res.status(500).json({
              message: "Something went wrong while checking phone",
              error: phoneError.message,
            });
          }

          if (phoneResult.length !== 0) {
            return res.status(400).json({ message: "Phone number already exists" });
          }

          // Check if department exists
          db.query(
            "SELECT * FROM Departments WHERE depId = ?",
            [depId],
            (depError, depResult) => {
              if (depError) {
                return res.status(500).json({
                  message: "Something went wrong while checking department",
                  error: depError.message,
                });
              }

              if (depResult.length === 0) {
                return res.status(404).json({ message: "Department not found" });
              }

              // Check if post exists
              db.query(
                "SELECT * FROM Posts WHERE postId = ?",
                [postId],
                (postError, postResult) => {
                  if (postError) {
                    return res.status(500).json({
                      message: "Something went wrong while checking post",
                      error: postError.message,
                    });
                  }

                  if (postResult.length === 0) {
                    return res.status(404).json({ message: "Post not found" });
                  }

                  // Create staff
                  db.query(
                    "INSERT INTO Staffs (postId, depId, firstName, lastName, gender, DOB, email, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [postId, depId, firstName, lastName, gender, DOB, email, phone, address],
                    (insertErr, insertResult) => {
                      if (insertErr) {
                        return res.status(500).json({
                          message: "Something went wrong while creating staff",
                          error: insertErr.message,
                        });
                      }

                      return res.status(201).json({
                        message: "Staff created successfully",
                        id: insertResult.insertId,
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
};

// Get All Staffs
exports.getAll = (req, res) => {
  db.query(
    `SELECT s.*, d.depName, p.postTitle 
     FROM Staffs s 
     JOIN Departments d ON s.depId = d.depId 
     JOIN Posts p ON s.postId = p.postId`,
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while fetching staffs",
          error: error.message,
        });
      }

      return res.status(200).json(result);
    }
  );
};

// Get Staff by ID
exports.getById = (req, res) => {
  const employeeId = req.params.id;

  db.query(
    `SELECT s.*, d.depName, p.postTitle 
     FROM Staffs s 
     JOIN Departments d ON s.depId = d.depId 
     JOIN Posts p ON s.postId = p.postId
     WHERE s.employeeId = ?`,
    [employeeId],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while fetching staff",
          error: error.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Staff not found" });
      }

      return res.status(200).json(result[0]);
    }
  );
};

// Update Staff
exports.updateById = (req, res) => {
  const employeeId = req.params.id;
  const {
    postId,
    depId,
    firstName,
    lastName,
    gender,
    DOB,
    email,
    phone,
    address
  } = req.body;

  // Validate required fields
  if (!postId || !depId || !firstName || !lastName || !gender || !DOB || !email || !phone || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if department exists
  db.query(
    "SELECT * FROM Departments WHERE depId = ?",
    [depId],
    (depError, depResult) => {
      if (depError) {
        return res.status(500).json({
          message: "Something went wrong while checking department",
          error: depError.message,
        });
      }

      if (depResult.length === 0) {
        return res.status(404).json({ message: "Department not found" });
      }

      // Check if post exists
      db.query(
        "SELECT * FROM Posts WHERE postId = ?",
        [postId],
        (postError, postResult) => {
          if (postError) {
            return res.status(500).json({
              message: "Something went wrong while checking post",
              error: postError.message,
            });
          }

          if (postResult.length === 0) {
            return res.status(404).json({ message: "Post not found" });
          }

          // Check if email already exists for other staff
          db.query(
            "SELECT * FROM Staffs WHERE email = ? AND employeeId != ?",
            [email, employeeId],
            (emailError, emailResult) => {
              if (emailError) {
                return res.status(500).json({
                  message: "Something went wrong while checking email",
                  error: emailError.message,
                });
              }

              if (emailResult.length !== 0) {
                return res.status(400).json({ message: "Email already exists" });
              }

              // Check if phone already exists for other staff
              db.query(
                "SELECT * FROM Staffs WHERE phone = ? AND employeeId != ?",
                [phone, employeeId],
                (phoneError, phoneResult) => {
                  if (phoneError) {
                    return res.status(500).json({
                      message: "Something went wrong while checking phone",
                      error: phoneError.message,
                    });
                  }

                  if (phoneResult.length !== 0) {
                    return res.status(400).json({ message: "Phone number already exists" });
                  }

                  // Update staff
                  db.query(
                    "UPDATE Staffs SET postId = ?, depId = ?, firstName = ?, lastName = ?, gender = ?, DOB = ?, email = ?, phone = ?, address = ? WHERE employeeId = ?",
                    [postId, depId, firstName, lastName, gender, DOB, email, phone, address, employeeId],
                    (updateErr, updateResult) => {
                      if (updateErr) {
                        return res.status(500).json({
                          message: "Something went wrong while updating staff",
                          error: updateErr.message,
                        });
                      }

                      if (updateResult.affectedRows === 0) {
                        return res.status(404).json({ message: "Staff not found" });
                      }

                      return res.status(200).json({ message: "Staff updated successfully" });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
};

// Delete Staff
exports.deleteById = (req, res) => {
  const employeeId = req.params.id;

  db.query(
    "DELETE FROM Staffs WHERE employeeId = ?",
    [employeeId],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while deleting staff",
          error: error.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Staff not found" });
      }

      return res.status(200).json({ message: "Staff deleted successfully" });
    }
  );
};