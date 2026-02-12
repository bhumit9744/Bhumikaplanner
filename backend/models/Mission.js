const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema({
  title: { type: String, required: true },
    subject: { type: String, required: true },
      type: { type: String, required: true }, // Assignment/Exam/Project
        deadline: { type: Date, required: true },
          resourceLink: { type: String },

            createdByUID: { type: String, required: true },
              createdAt: { type: Date, default: Date.now }
              });

              module.exports = mongoose.model("Mission", missionSchema);l