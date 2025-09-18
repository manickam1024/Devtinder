const express = require("express");
const router = express.Router();
const { User } = require("../../schema/user");
const userAuth = require("../../middlewares/authentication");

router.get("/getprofile", userAuth, async (req, res) => {
  try {
    const id = req.id; // coming from the middleware userAuth
    const user = await User.findOne({ _id: id });
    if (user) {
      res.send(user); //sending the user details to the user
    }
  } catch (err) {
    res.send("defined error " + err); // for async ops like .send(), jwt.verify is also async
  }
});
router.put("/updateEverything", async (req, res) => {
  try {
    const firstName = req.body.firstName;
    const newdata = req.body;

    const settled = await User.replaceOne(
      { firstName: firstName }, // using the first as the key i have updated the body
      newdata,
      {
        new: true,
        overwrite: true, //here the leftout fields are written null

        strict: false,
      },
    );
    res.send(settled + "  ...updated");
  } catch (err) {
    res.send("defined error " + err); // for async ops like .send()
  }
});
router.patch("/updatePart", async (req, res) => {
  try {
    const id = req.body._id;
    const newdata = req.body;
    const keyofschema = Object.keys(User.schema.paths);
    const filter = Object.keys(newdata).every((k) => {
      // here we r checking wheather the keys entered by the user are present in the schema or not. it returns true or false
      keyofschema.includes(k);
    });
    console.log(filter);

    if (filter) {
      const settled = await User.findByIdAndUpdate(id, newdata, {
        // here the leftout feilds are written with previous data because of no overwrite
        // the modifers are compared automatically only validators are explicitly mentioned
        new: true,
        runValidators: true,
      });

      res.send(settled + "  ...updated");
    } else {
      res.send("invalid fields entered");
    }
  } catch (err) {
    res.send("defined error " + err); // for async ops like .send()
  }
});
router.patch("/password", userAuth, (req, res) => {});

module.exports = router;
