const Mission = require("../models/Mission");

const createMission = async (req, res) => {
  try {
      const mission = await Mission.create(req.body);
          res.status(201).json(mission);
            } catch (err) {
                res.status(400).json({ message: err.message });
                  }
                  };

                  const getMissions = async (req, res) => {
                    const missions = await Mission.find().sort({ deadline: 1 });
                      res.json(missions);
                      };

                      const deleteMission = async (req, res) => {
                        await Mission.findByIdAndDelete(req.params.id);
                          res.json({ message: "Mission deleted" });
                          };

                          module.exports = { createMission, getMissions, deleteMission };