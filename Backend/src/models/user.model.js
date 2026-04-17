const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: [true, "username is required"],
    unique: [true, "username already exist"],
  },
  email: {
    type: String,
    require: [true, "email is required"],
    unique: [true, "email already exist"],
  },
  password: {
    type: String,
    require: [true, "password is required"],
    select: false,
  },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
