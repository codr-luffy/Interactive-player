const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  url: {
    type: String,
    require: [true, "url is required"],
  },
  posterUrl: {
    type: String,
    require: [true, "posterUrl is required"],
  },
  title: {
    type: String,
    require: [true, "title is required"],
  },
  mood: {
    type: String,
    enum: {
      values: ["sad", "happy", "chill", "surprised", "relaxed", "tired"],
      message: "{VALUE} is not supported",
    },
  },
});

const songModel = mongoose.model("songs", songSchema);

module.exports = songModel;
