const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  uid: { type: String, required: true }, // owner
    title: { type: String, required: true },
      datetime: { type: Date, required: true },
        done: { type: Boolean, default: false },

          createdAt: { type: Date, default: Date.now }
          });

          module.exports = mongoose.model("Reminder", reminderSchema);