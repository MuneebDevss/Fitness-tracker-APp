const feedBack = require("../models/FeedBack");

const feedBackController = {
  // Get all feedBack activities for a user
  getfeedBack: async (req, res) => {
    try {
      const feedBackActivities = await feedBack.find();
      res.status(200).json(feedBackActivities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching feedBack activities" });
    }
  },

  // Add a new feedBack activity
  addfeedBack: async (req, res) => {
    try {
      const { userId, description } = req.body;
      const newfeedBack = await feedBack.create({ userId, description });
      res.status(201).json(newfeedBack);
    } catch (error) {
      res.status(400).json({ message: "Error adding feedBack activity" });
    }
  },

  // Delete a feedBack activity
  deletefeedBack: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedfeedBack = await feedBack.findByIdAndDelete(id);
      if (!deletedfeedBack) {
        return res.status(404).json({ message: "feedBack activity not found" });
      }
      res.status(200).json({ message: "feedBack activity deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting feedBack activity" });
    }
  },
};

module.exports = feedBackController;