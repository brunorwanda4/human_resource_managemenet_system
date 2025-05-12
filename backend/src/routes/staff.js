const express = require("express");
const router = express.Router();

const staffCont = require("../controllers/staffControllers");

router.post("/", staffCont.createStaff);
router.get("/", staffCont.getAll);
router.get("/:id", staffCont.getById);
router.put("/:id", staffCont.updateById);
router.delete("/:id", staffCont.deleteById);

module.exports = router;