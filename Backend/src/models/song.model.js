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

songSchema.statics.random = async function (mood = null) {
  try {
    // Use $sample to randomly select 1 document
    const matchStage = mood ? { $match: { mood } } : { $match: {} };
    const result = await this.aggregate([
      matchStage,
      { $sample: { size: 1 } }, // size: 1 = return 1 random document
    ]);

    // $sample returns an array; extract the first (and only) element
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    throw new Error(`Error fetching random document: ${error.message}`);
  }
};

const songModel = mongoose.model("songs", songSchema);

module.exports = songModel;
