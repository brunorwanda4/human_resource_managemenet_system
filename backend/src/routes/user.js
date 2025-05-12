const express = require("express");
const router = express.Router();

const userCont = require("../controllers/userControllers");

router.post("/", userCont.createUser);
router.get("/", userCont.getAll);
router.get("/:id", userCont.getById);
router.put("/:id", userCont.updateById);
router.delete("/:id", userCont.deleteById);

module.exports = router;