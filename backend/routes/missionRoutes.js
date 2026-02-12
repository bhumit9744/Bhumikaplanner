const express = require("express");
const router = express.Router();
const {
  createMission,
    getMissions,
      deleteMission
      } = require("../controllers/missionController");

      router.get("/", getMissions);
      router.post("/", createMission);
      router.delete("/:id", deleteMission);

      module.exports = router;
      