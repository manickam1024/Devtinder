const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
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
    skills: {
      type: [String],
      validate(arr) {
        if (!(arr.length <= 10)) {
          throw Error("maximun skills are 10");
        }
        // or return arr.length <= 10; or can be done dynamically at api
      },
    },
  },
  {
    timestamps: true,
  },
);

try {
  //it can be written in login api itself but to keep the code clean im writing it here
  userSchema.methods.passwordVerification = async function (password) {
    const document = this; // this refers to the document on which this method is called
    const ismatch = await bcrypt.compare(password, document.password); // the plain password entered by the user and the hashed password in the database and
    return ismatch; // it returns true or false
  };
} catch (err) {
  throw "error in password verification method" + err;
}

try {
  userSchema.methods.jwtCreation = function () {
    const document = this; // this refers to the document on which this method is called
    const token = jwt.sign({ myid: document._id }, "User@123", {
      // if the user is authenticated then next step is to  create a token
    });
    return token;
  };
} catch (err) {
  throw "error in jwt creation method" + err;
}

const User = mongoose.model("users", userSchema);

module.exports = { User };
