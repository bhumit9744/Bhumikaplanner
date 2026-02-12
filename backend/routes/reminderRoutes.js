const express = require("express");
const router = express.Router();
const {
  createReminder,
    getReminders,
      markDone
      } = require("../controllers/reminderController");

      router.get("/:uid", getReminders);
      router.post("/", createReminder);
      router.put("/done/:id", markDone);

      module.exports = router;