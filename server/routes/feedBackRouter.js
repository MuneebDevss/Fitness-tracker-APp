const router = require("express").Router();
const {
  getfeedBack,
  addfeedBack,
  deletefeedBack,
} = require("../controllers/feedBackController");

// Get all feedBack activities for a user
router.get("/", getfeedBack);

// Add a new feedBack activity
router.post("/", addfeedBack);

// Delete a feedBack activity
router.delete("/:id", deletefeedBack);

module.exports = router;