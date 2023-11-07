require("dotenv").config();
const mongoose = require("mongoose");

console.log(process.env.MONGODB_URL);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Successfully connected to MondoDB Atlas!");
  })
  .catch((error) => {
    console.log("Unable to connect to MongoDB Atlas!");
    console.log(error);
  });
