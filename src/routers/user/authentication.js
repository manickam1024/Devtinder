const express = require("express");
const router = express.Router();
const { User } = require("../../schema/user"); // this is the instance of the model which contains the schema using this instnace we insert the data
const encryption = require("../../utils/encryption");

router.post("/register", async (req, res) => {
  // it wont be trigeered untill the user (post man u send post with data) request
  try {
    const { password, ...rest } = req.body; // instead of destructing all the fields use ...rest
    const hashed = await encryption(password, res); // await because whever i call encryption interally a promise is called ,but js goes to execute next line
    const newuser = new User({ ...rest, password: hashed });
    const result = await newuser.save(); // inserts the document into db and adds id and __v (versions) of the document
    res.send(result);
  } catch (err) {
    res.send("defined error " + err); // for async ops like .send()
  }
});
router.post("/login", async (req, res) => {
  try {
    const { password, email } = req.body;
    if (!email || !password) {
      return res.send("email or password cannot be empty"); //authentication
    }
    const document = await User.findOne({ email }); // finding wheather my email exists in the db or not if yes return the document
    if (!document) {
      return res.send("invalid credentials"); // instead of if else if use return to stop the execution
    }

    const isverifedUser = await document.passwordVerification(password);
    console.log(document.passwordVerification);
    if (!isverifedUser) {
      return res.send("invalid credentials"); // im not exposing which one is wrong to prevent data breach /leak
    }
    const token = await document.jwtCreation(); // creating the token if the user is authenticated
    res.cookie("token", token); //creating and sending the cookie to browser
    res.send("logged in successfully");
  } catch (err) {
    res.send("defined error " + err);
  }
});
router.post("/logout", (req, res) => {});

module.exports = router;
