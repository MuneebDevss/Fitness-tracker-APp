const { Schema, model } = require("mongoose");

const FeedBack = new Schema(
  {
    userId: {
      type: String,
      required: true,
      required: true
    },
    description: {
      type: String,
      required: true,
      maxlength: 30
    },
  }
);

const feedBack = model("FeedBack", FeedBack);

module.exports = feedBack;
