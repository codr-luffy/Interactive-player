require("dotenv").config();
const app = require("./src/App.js");
const connectToDB = require("./src/config/dataBase.js");

connectToDB();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
