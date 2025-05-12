const db = require("../config/db");

// Create Post
exports.createPost = (req, res) => {
  const { postTitle } = req.body;

  if (!postTitle) {
    return res.status(400).json({ message: "postTitle is required" });
  }

  db.query(
    "SELECT * FROM Posts WHERE postTitle = ?",
    [postTitle],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while checking post",
          error: error.message,
        });
      }

      if (result.length !== 0) {
        return res.status(400).json({ message: "Post title already exists" });
      }

      db.query(
        "INSERT INTO Posts (postTitle) VALUES (?)",
        [postTitle],
        (insertErr, insertResult) => {
          if (insertErr) {
            return res.status(500).json({
              message: "Something went wrong while creating post",
              error: insertErr.message,
            });
          }

          return res.status(201).json({
            message: "Post created successfully",
            id: insertResult.insertId,
          });
        }
      );
    }
  );
};

// Get All Posts
exports.getAll = (req, res) => {
  db.query("SELECT * FROM Posts", (error, result) => {
    if (error) {
      return res.status(500).json({
        message: "Something went wrong while fetching posts",
        error: error.message,
      });
    }

    return res.status(200).json(result);
  });
};

// Get Post by ID
exports.getById = (req, res) => {
  const postId = req.params.id;

  db.query(
    "SELECT * FROM Posts WHERE postId = ?",
    [postId],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while fetching post",
          error: error.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json(result[0]);
    }
  );
};

// Update Post
exports.updateById = (req, res) => {
  const postId = req.params.id;
  const { postTitle } = req.body;

  if (!postTitle) {
    return res.status(400).json({ message: "postTitle is required" });
  }

  db.query(
    "SELECT * FROM Posts WHERE postTitle = ? AND postId != ?",
    [postTitle, postId],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while checking post",
          error: error.message,
        });
      }

      if (result.length !== 0) {
        return res.status(400).json({ message: "Post title already exists" });
      }

      db.query(
        "UPDATE Posts SET postTitle = ? WHERE postId = ?",
        [postTitle, postId],
        (updateErr, updateResult) => {
          if (updateErr) {
            return res.status(500).json({
              message: "Something went wrong while updating post",
              error: updateErr.message,
            });
          }

          if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: "Post not found" });
          }

          return res.status(200).json({ message: "Post updated successfully" });
        }
      );
    }
  );
};

// Delete Post
exports.deleteById = (req, res) => {
  const postId = req.params.id;

  db.query(
    "DELETE FROM Posts WHERE postId = ?",
    [postId],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Something went wrong while deleting post",
          error: error.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json({ message: "Post deleted successfully" });
    }
  );
};