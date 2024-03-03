const express = require("express");
const { addAnswer, getAnswers } = require("../controller/answerController");
const { authenticateToken } = require("../middleware/auth");


const router = express.Router();

router.post('/:id',authenticateToken,addAnswer);
router.get('/:id',authenticateToken,getAnswers);

module.exports = router;