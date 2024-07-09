const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  duration: {
    type: String,
    required: [true, "Duration is required"],
  },
  status: {
    type: String,
    default: "pending",
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Workout", workoutSchema);
