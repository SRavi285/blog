const mongoose = require("mongoose");
const { connectionURL } = require("../config/keys");

const connectMongodb = async () => {
  try {
    await mongoose.connect(connectionURL);
    console.log("Connected to Database");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectMongodb;
