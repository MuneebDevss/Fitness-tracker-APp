const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: "Username is Required",
  },

  password: {
    type: String,
    trim: true,
    required: "Password is Required",
    minlength: 6,
  },

  trainerId: {
    type: String,
    trim: true,
    unique: true,
    default:'',
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  email: {
    type: String,
    unique: true,
    match: [/.+@.+\..+/],
  },

  role: {
    type: String,
    enum: ["Admin", "Trainer", "User"], // Restricts the values to these options
    default: "User", // Default role is "User"
    required: true,
  },

  cardio: [
    {
      type: Schema.Types.ObjectId,
      ref: "Cardio",
    },
  ],

  resistance: [
    {
      type: Schema.Types.ObjectId,
      ref: "Resistance",
    },
  ],
});

// Hash user password
UserSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// Custom method to compare and validate password for logging in
UserSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", UserSchema);

module.exports = User;
