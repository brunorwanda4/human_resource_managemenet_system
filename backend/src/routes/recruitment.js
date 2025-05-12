const express = require("express");
const router = express.Router();

const recruitmentCont = require("../controllers/recruitmentControllers");

router.post("/", recruitmentCont.createRecruitment);
router.get("/", recruitmentCont.getAll);
router.get("/:id", recruitmentCont.getById);
router.get("/employee/:id", recruitmentCont.getByEmployeeId);
router.put("/:id", recruitmentCont.updateById);
router.delete("/:id", recruitmentCont.deleteById);

module.exports = router;