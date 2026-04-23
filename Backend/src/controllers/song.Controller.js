const songModel = require("../models/song.model.js");
const storageService = require("../services/storage.service.js");
const id3 = require("node-id3");

async function createSong(req, res) {
  const songBuffer = req.file.buffer;
  const { mood } = req.body;

  const tags = id3.read(songBuffer);

  const [songFile, posterFile] = await Promise.all([
    storageService.uploadFile({
      buffer: songBuffer,
      fileName: tags.title + ".mp3",
      folder: "/modify/songs",
    }),
    storageService.uploadFile({
      buffer: tags.image.imageBuffer,
      fileName: tags.title + ".jpg",
      folder: "/modify/posters",
    }),
  ]);

  const song = await songModel.create({
    title: tags.title,
    posterUrl: posterFile.url,
    url: songFile.url,
    mood,
  });

  res.status(201).json({
    message: "song created successfully",
    song,
  });
}

async function getSong(req, res) {
  try {
    const { mood } = req.query;
    const songs = await songModel.getByMood(mood);

    if (!songs.length) {
      return res.status(404).json({ message: "No songs found for this mood" });
    }

    res.status(200).json({
      message: "Songs fetched successfully",
      count: songs.length,
      songs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

// try {
//   const { mood } = req.query;
//   const song = await songModel.random(mood);
//
//   res.status(200).json({
//     message: "song fetched successfully",
//     song,
//   });
// } catch (error) {
//   res.status(500).json({ message: error.message });
//   console.log(error);
// }

module.exports = { createSong, getSong };
