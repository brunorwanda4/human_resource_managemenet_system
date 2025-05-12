const express = require("express");
const router = express.Router();

const postCont = require("../controllers/postControllers");

router.post("/", postCont.createPost);
router.get("/", postCont.getAll);
router.get("/:id", postCont.getById);
router.put("/:id", postCont.updateById);
router.delete("/:id", postCont.deleteById);

module.exports = router;