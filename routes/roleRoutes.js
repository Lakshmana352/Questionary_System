const express = require("express");
const { createRole, getAllRoles } = require("../controller/roleController");

const router = express.Router();

router.post('/',createRole);
router.get('/',getAllRoles);

module.exports = router;