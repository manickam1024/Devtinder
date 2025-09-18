const express = require("express");
const router = express.Router();
const { User } = require("../../schema/user");
const userAuth = require("../../middlewares/authentication");
const isallowed = require("../../utils/allowedfields");

router.get("/getprofile", userAuth, async (req, res) => {
  try {
    const user = req.user; // coming from the middleware userAuth
    if (user) {
      res.send(user); //sending the user details to the user
    }
  } catch (err) {
    res.send("defined error " + err); // for async ops like .send(), jwt.verify is also async
  }
});
router.put("/updateEverything", userAuth, async (req, res) => {
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
router.patch("/updatePart", userAuth, async (req, res) => {
  try {
    const id = req.body._id;
    const newdata = req.body;
    isallowed = isallowed(req); // it checks wheather the fields entered by user are allowed to be updated or not

    if (isallowed) {
      const settled = await User.findByIdAndUpdate(id, newdata, {
        new: true,
        runValidators: true, // here the leftout feilds are written with previous data because of no overwrite
        // the modifers are compared automatically only validators are explicitly mentioned
      });

      res.send(settled + "  ...updated");
    } else {
      res.send("fields email,password cannot be edited");
    }
  } catch (err) {
    res.send("defined error " + err); // for async ops like .send()
  }
});
router.patch("/password", userAuth, (req, res) => {});

module.exports = router;
