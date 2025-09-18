const express = require("express");
const router = express.Router();
const { User } = require("../../schema/user"); // this is the instance of the model which contains the schema using this instnace we insert the data

router.delete("/deleteone", async (req, res) => {
  try {
    const id = req.body._id;
    const settled = await User.findByIdAndDelete(id);
    res.send(settled + "  .................deleted");
  } catch (err) {
    res.send("defined error " + err); // for async ops like .send()
  }
});

router.delete("/deleteMany", async (req, res) => {
  try {
    const name = req.body.firstName;
    console.log(name);
    const settled = await User.deleteMany({ firstName: name });
    res.send(settled + "  .................deleted");
  } catch (err) {
    res.send("defined error " + err); // for async ops like .send()
  }
});

module.exports = router;
