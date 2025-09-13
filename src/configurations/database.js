const mongoose = require("mongoose");

const connection = async () => {
  await mongoose.connect(
    "mongodb+srv://manickam:08052016@gemdb.e96u4rg.mongodb.net/tinder", // connected to the cluster and  to the databse (/tinder)
  );
};
module.exports = { connection };
