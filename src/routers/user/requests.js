const express = require("express");
const router = express.Router();
const Connection = require("../../schema/connectionSchema"); //
const userAuth = require("../../middlewares/authentication");

router.post("/sent/:status/:toid", userAuth, async (req, res) => {
  try {
    const fromid = req.user._id;
    const toid = req.params.toid;
    const status = req.params.status;
    const allowedStatus = ["intrested", "notIntrested"];
    const includes = allowedStatus.includes(status);
    if (includes) {
      const newreq = new Connection({ fromid, toid, status });
      await newreq.save(); // checks wheather it has any pre and post hooks
      res.send("saved successfully");
    } else {
      throw new Error("invalid status id received");
    }
  } catch (err) {
    res.status(400).send(err.message);
    console.log("error at request.js file /intrested");
  }
});

router.patch("/received/:status/:toid", userAuth, async (req, res) => {
  try {
    const fromid = req.user._id;
    const toid = req.params.toid;
    const status = req.params.status;
    const allowedStatus = ["accepted", "rejected"];
    const includes = allowedStatus.includes(status);

    if (includes) {
      const document = await Connection.findOne({ fromid, toid });
      if (document && document.status == "intrested") {
        const editedDocument = await Connection.updateOne({
          fromid: fromid,
          toid: toid,
          status: status,
        });

        res.send("sucessfully responded!!! " + editedDocument);
      } else {
        res.send("something went wrong!!!");
      }
    }
  } catch (err) {
    res.send(err);
    console.log(err + " error at request.js /received");
  }
});

module.exports = router;
