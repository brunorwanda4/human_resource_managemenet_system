const db = require("../config/db");

// Create Recruitment Record
exports.createRecruitment = (req, res) => {
  const { salary, status, employeeId } = req.body;

  if (!salary || !status || !employeeId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if employee exists
  db.query(
    "SELECT * FROM Staffs WHERE employeeId = ?",
    [employeeId],
    (employeeError, employeeResult) => {
      if (employeeError) {
        return res.status(500).json({
          message: "Something went wrong while checking employee",
          error: employeeError.message,
        });
      }

      if (employeeResult.length === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Check if recruitment record already exists for this employee
      db.query(
        "SELECT * FROM Recruitment WHERE employeeId = ?",
        [employeeId],
        (recruitmentError, recruitmentResult) => {
          if (recruitmentError) {
            return res.status(500).json({
              message: "Something went wrong while checking recruitment record",
              error: recruitmentError.message,
            });
          }

          if (recruitmentResult.length !== 0) {
            return res.status(400).json({ message: "Recruitment record already exists for this employee" });
          }

          // Create recruitment record
          db.query(
            "INSERT INTO Recruitment (salary, status, employeeId) VALUES (?, ?, ?)",
            [salary, status, employeeId],
            (insertErr, insertResult) => {
              if (insertErr) {
                return res.status(500).json({
                  message: "Something went wrong while creating recruitment record",
                  error: insertErr.message,
                });
              }

              return res.status(201).json({
                message: "Recruitment record created successfully",
                id: insertResult.insertId,
              });
            }
          );
        }
      );
    }
  );
};

// Get All Recruitment Records
exports.getAll = (req, res) => {
  db.query(
    `SELECT r.*, s.firstName, s.lastName 
     FROM Recruitment r 
     JOIN Staffs s ON r.employeeId = s.employeeId`,
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while fetching recruitment records",
          error: error.message,
        });
      }

      return res.status(200).json(result);
    }
  );
};

// Get Recruitment Record by ID
exports.getById = (req, res) => {
  const recId = req.params.id;

  db.query(
    `SELECT r.*, s.firstName, s.lastName 
     FROM Recruitment r 
     JOIN Staffs s ON r.employeeId = s.employeeId
     WHERE r.recId = ?`,
    [recId],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while fetching recruitment record",
          error: error.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Recruitment record not found" });
      }

      return res.status(200).json(result[0]);
    }
  );
};

// Get Recruitment Record by Employee ID
exports.getByEmployeeId = (req, res) => {
  const employeeId = req.params.id;

  db.query(
    `SELECT r.*, s.firstName, s.lastName 
     FROM Recruitment r 
     JOIN Staffs s ON r.employeeId = s.employeeId
     WHERE r.employeeId = ?`,
    [employeeId],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while fetching recruitment record",
          error: error.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Recruitment record not found for this employee" });
      }

      return res.status(200).json(result[0]);
    }
  );
};

// Update Recruitment Record
exports.updateById = (req, res) => {
  const recId = req.params.id;
  const { salary, status } = req.body;

  if (!salary && !status) {
    return res.status(400).json({ message: "At least one field (salary or status) is required" });
  }

  let updateFields = {};
  let updateQuery = "UPDATE Recruitment SET ";
  let queryParams = [];

  if (salary) {
    updateFields.salary = salary;
    updateQuery += "salary = ?, ";
    queryParams.push(salary);
  }

  if (status) {
    updateFields.status = status;
    updateQuery += "status = ?, ";
    queryParams.push(status);
  }

  // Remove trailing comma and space
  updateQuery = updateQuery.slice(0, -2);
  updateQuery += " WHERE recId = ?";
  queryParams.push(recId);

  // Update recruitment record
  db.query(
    updateQuery,
    queryParams,
    (updateErr, updateResult) => {
      if (updateErr) {
        return res.status(500).json({
          message: "Something went wrong while updating recruitment record",
          error: updateErr.message,
        });
      }

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: "Recruitment record not found" });
      }

      return res.status(200).json({ message: "Recruitment record updated successfully" });
    }
  );
};

// Delete Recruitment Record
exports.deleteById = (req, res) => {
  const recId = req.params.id;

  db.query(
    "DELETE FROM Recruitment WHERE recId = ?",
    [recId],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while deleting recruitment record",
          error: error.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Recruitment record not found" });
      }

      return res.status(200).json({ message: "Recruitment record deleted successfully" });
    }
  );
};