const express = require("express");
const router = express.Router();
const { getScratchpad, updateScratchpad } = require("../controllers/scratchpadController");

router.get("/", getScratchpad);
router.put("/", updateScratchpad);

module.exports = router;