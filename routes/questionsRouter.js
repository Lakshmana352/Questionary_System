const express = require("express");
const { addQuestion, getQuestions } = require("../controller/questionsConterller");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.post('/:id',authenticateToken,addQuestion);
router.get('/:id',authenticateToken,getQuestions);

module.exports = router;