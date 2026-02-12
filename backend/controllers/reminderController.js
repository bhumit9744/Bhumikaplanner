const Reminder = require("../models/Reminder");

const createReminder = async (req, res) => {
  const reminder = await Reminder.create(req.body);
    res.status(201).json(reminder);
    };

    const getReminders = async (req, res) => {
      const reminders = await Reminder.find({ uid: req.params.uid }).sort({ datetime: 1 });
        res.json(reminders);
        };

        const markDone = async (req, res) => {
          const reminder = await Reminder.findById(req.params.id);
            reminder.done = true;
              await reminder.save();
                res.json(reminder);
                };

                module.exports = { createReminder, getReminders, markDone };