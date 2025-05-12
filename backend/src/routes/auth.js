const express = require("express");
const router = express.Router();
const authCont = require("../controllers/authController");

router.post("/login", authCont.login);
router.post("/logout", authCont.logout);
router.get("/me", authCont.getCurrentUser);

module.exports = router;