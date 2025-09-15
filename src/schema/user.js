const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minLength: 3,
      maxLength: 10,
    },
    lastName: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minLength: 1,
      maxLength: 5,
    },
    email: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minLength: 1,
      maxLength: 50,
      immutable: false,
      unique: true,
    },
    age: {
      type: String,
      default: null,
      validate(value) {
        if (!(value >= 18 && value <= 60)) {
          throw Error("enter the age between 18 to 60");
        }
      },
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("users", schema); //

module.exports = User;
