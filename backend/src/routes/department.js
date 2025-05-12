const express = require("express");
const router = express.Router();

const depCont = require("../controllers/departmentControllers");

router.post("/", depCont.createDepartment);
router.get("/", depCont.getAll);
router.get("/:id", depCont.getById);
router.put("/:id", depCont.updateById);
router.delete("/:id", depCont.deleteById);

module.exports = router;