const express = require("express");
const router = express.Router();
const Connection = require("../../schema/connectionSchema"); //
const userAuth = require("../../middlewares/authentication");

router.post("/sent/intrested/:toid", userAuth, async (req, res) => {
  try {
    const fromid = req.user._id;
    const toid = req.params.toid;
    const status = "intrested";
    const newreq = new Connection({ fromid, toid, status });
    await newreq.save();
    res.send("saved successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});
router.post("/sent/notintrested", () => {});

module.exports = router;
