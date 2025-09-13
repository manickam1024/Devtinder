const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  firstName: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
  age: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("users", schema); //

module.exports = User;
