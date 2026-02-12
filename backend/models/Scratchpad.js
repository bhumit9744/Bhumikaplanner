const mongoose = require("mongoose");

const scratchpadSchema = new mongoose.Schema({
  content: { type: String, default: "" },
    lastEditedByUID: { type: String },
      lastEditedAt: { type: Date, default: Date.now }
      });

      module.exports = mongoose.model("Scratchpad", scratchpadSchema);