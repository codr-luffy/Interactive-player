const express = require("express");
const cookieParser = require("cookie-parser");
const Authrouter = require("./routes/auth.routes.js");
const Songrouter = require("./routes/song.routes.js");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", Authrouter);
app.use("/api/songs", Songrouter);

module.exports = app;
