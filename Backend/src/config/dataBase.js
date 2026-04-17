const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(`Database connection ${err}`));
}

module.exports = connectToDB;
