const { Cardio, User } = require("../models");

module.exports = {
  // create cardio
  createCardio({ body }, res) {
    // Ensure the required fields are in the body
    if (!body.userId || !body.distance || !body.duration || !body.date || !body.name) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Create a new cardio entry
    Cardio.create(body)
      .then((dbCardioData) => {
        // Update the user with the new cardio entry
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { cardio: dbCardioData._id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "No user found with this id!" });
        }
        res.json({ message: "Cardio successfully created!" });
      })
      .catch((err) => res.status(500).json(err));
  },

  // get cardio by id
  getCardioById({ params }, res) {
    // Find the cardio entry by its ID
    Cardio.findById(params.id)
      .then((dbCardioData) => {
        if (!dbCardioData) {
          return res.status(404).json({ message: "Cardio not found!" });
        }
        res.json(dbCardioData);
      })
      .catch((err) => res.status(500).json(err));
  },

  // delete cardio
  deleteCardio({ params }, res) {
    // First, delete the cardio entry
    Cardio.findByIdAndDelete(params.id)
      .then((dbCardioData) => {
        if (!dbCardioData) {
          return res.status(404).json({ message: "Cardio not found!" });
        }
        // Then update the user by pulling the deleted cardio reference
        return User.findOneAndUpdate(
          { cardio: params.id },
          { $pull: { cardio: params.id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "No user found!" });
        }
        res.json({ message: "Cardio deleted!" });
      })
      .catch((err) => res.status(500).json(err));
  },
};
