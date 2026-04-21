const express = require("express");
const upload = require("../middlewares/upload.middleware.js");
const songController = require("../controllers/song.Controller.js");

const router = express.Router();

router.post("/", upload.single("song"), songController.createSong);
router.get("/", songController.getSong);

module.exports = router;
