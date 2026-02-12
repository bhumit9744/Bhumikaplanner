const Scratchpad = require("../models/Scratchpad");

const getScratchpad = async (req, res) => {
  let pad = await Scratchpad.findOne();
    if (!pad) pad = await Scratchpad.create({ content: "" });
      res.json(pad);
      };

      const updateScratchpad = async (req, res) => {
        let pad = await Scratchpad.findOne();
          if (!pad) pad = await Scratchpad.create({ content: "" });

            pad.content = req.body.content;
              pad.lastEditedByUID = req.body.uid;
                pad.lastEditedAt = new Date();

                  await pad.save();
                    res.json(pad);
                    };

                    module.exports = { getScratchpad, updateScratchpad };