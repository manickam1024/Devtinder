const { User } = require("../../schema/user");
const express = require("express");
const router = express.Router();
const userAuth = require("../../middlewares/authentication");
const exceptionList = require("../../utils/exceptionlist");

router.get("/feed", userAuth, async (req, res) => {
  try {
    const List = await exceptionList(req, res);
    const result = await User.find(
      { _id: { $nin: List } }, //filter
      { _id: 1, firstName: 1 }, //projection
      { limit: 0 } //options-get only 10 users
    ); //  $notin makes the mangoose to validate the users against the exceptionlist and make sures its not selected,{ _id: 1 }-this is to oly include _id and firstName

    res.send(result);
  } catch (err) {
    res.status(400).send("error at " + __filename + err);
  }
});

module.exports = router;
