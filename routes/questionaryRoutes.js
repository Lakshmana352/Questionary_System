const express = require("express");
const { createQuestionarie } = require("../controller/questionarieController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.post('/',authenticateToken,createQuestionarie);

module.exports = router;