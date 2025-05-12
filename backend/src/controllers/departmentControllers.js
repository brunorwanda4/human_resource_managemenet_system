const db = require("../config/db");

// Create Department
exports.createDepartment = (req, res) => {
  const { depName } = req.body;

  if (!depName) {
    return res.status(400).json({ message: "depName is required" });
  }

  db.query(
    "SELECT * FROM Departments WHERE depName = ?",
    [depName],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while checking department",
          error: error.message,
        });
      }

      if (result.length !== 0) {
        return res
          .status(400)
          .json({ message: "Department name already exists" });
      }

      db.query(
        "INSERT INTO Departments (depName) VALUES (?)",
        [depName],
        (insertErr, insertResult) => {
          if (insertErr) {
            return res.status(500).json({
              message: "Something went wrong while creating department",
              error: insertErr.message,
            });
          }

          return res.status(201).json({
            message: "Department created successfully",
            id: insertResult.insertId,
          });
        }
      );
    }
  );
};

// Get All Departments
exports.getAll = (req, res) => {
  db.query("SELECT * FROM Departments", (error, result) => {
    if (error) {
      return res.status(500).json({
        message: "Something went wrong while fetching departments",
        error: error.message,
      });
    }

    return res.status(200).json(result);
  });
};

// Get Department by ID
exports.getById = (req, res) => {
  const depId = req.params.id;

  db.query(
    "SELECT * FROM Departments WHERE depId = ?",
    [depId],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while fetching department",
          error: error.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Department not found" });
      }

      return res.status(200).json(result[0]);
    }
  );
};

// Update Department
exports.updateById = (req, res) => {
  const depId = req.params.id;
  const { depName } = req.body;

  if (!depName) {
    return res.status(400).json({ message: "depName is required" });
  }

  db.query(
    "SELECT * FROM Departments WHERE depName = ? AND depId != ?",
    [depName, depId],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while checking department",
          error: error.message,
        });
      }

      if (result.length !== 0) {
        return res
          .status(400)
          .json({ message: "Department name already exists" });
      }

      db.query(
        "UPDATE Departments SET depName = ? WHERE depId = ?",
        [depName, depId],
        (updateErr, updateResult) => {
          if (updateErr) {
            return res.status(500).json({
              message: "Something went wrong while updating department",
              error: updateErr.message,
            });
          }

          if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: "Department not found" });
          }

          return res.status(200).json({ message: "Department updated successfully" });
        }
      );
    }
  );
};

// Delete Department
exports.deleteById = (req, res) => {
  const depId = req.params.id;

  db.query(
    "DELETE FROM Departments WHERE depId = ?",
    [depId],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while deleting department",
          error: error.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Department not found" });
      }

      return res.status(200).json({ message: "Department deleted successfully" });
    }
  );
};