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
    const loggedin_id = req.user._id;
    const reqsender_id = req.params.toid;
    const status = req.params.status;
    const allowedStatus = ["accepted", "rejected"];
    const includes = allowedStatus.includes(status);

    if (includes) {
      const document = await Connection.findOne({
        fromid: reqsender_id,
        toid: loggedin_id,
        status: "intrested",
      }); // this ensures both request sender and request aceepted person is not same in db when mani sneds a request it will be like fromid : mani,toid: vedika ........when vedhika logged in she should search wheather her name is in toid if yes it is the requests tht she received ......... if she accepts... then in params it will be mani id and session is vedhika id IE THE FROMID WILL BE MANI ID TO WILL BE VEdhhika ,now if mani logs in he would only find all the requests he have recieved
      if (document) {
        document.status = status; // instead of updateOne this is shortcut
        const data = await document.save();

        res.send("sucessfully responded!!! " + data);
      } else {
        res.status(404).send("no request exist to accept ");
      }
    } else {
      res.send(" status is apart from accepted or rejected");
    }
  } catch (err) {
    res.status(404).send(err.message);

    console.log(err + " error at request.js /received");
  }
});

module.exports = router;
