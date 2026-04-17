const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      tyep: String,
      required: [true, "token is required"],
    },
  },
  {
    timestamps: true,
  },
);

const blacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = blacklistModel;
