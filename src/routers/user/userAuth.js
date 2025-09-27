const express = require("express");
const router = express.Router();
const { User } = require("../../schema/user"); // this is the instance of the model which contains the schema using this instnace we insert the data
const encryption = require("../../utils/encryption");
const emailandpassverification = require("../../utils/emailandpasswordverification");

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
    console.log("error at authentication.js /register");
  }
});
router.post("/login", async (req, res) => {
  try {
    const { password, email } = req.body;
    if (!email || !password) {
      return res.send("email or password cannot be empty"); //authentication
    }
    const token = await emailandpassverification(email, password); // just to simplify and make code look clean
    res.cookie("token", token); //creating and sending the cookie to browser
    res.send("logged in successfully");
  } catch (err) {
    console.log("error at router/user/userAuth.js /login");
    res.send("invalid credentials"); // for async ops like .send()
  }
});
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token"); // just clearing the cookie
    res.send("logged out successfully");
  } catch (err) {
    console.log("error at userAuth.js /logout");
  }
});

module.exports = router;
