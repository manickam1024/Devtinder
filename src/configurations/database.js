const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://manickam:08052016@gemdb.e96u4rg.mongodb.net/tinder", // connected to the cluster and  to the databse (/tinder)
    );
  } catch (err) {
    res.send("error at connection of database");
    console.log("error at database.js ");
  }
};
module.exports = { connection };
