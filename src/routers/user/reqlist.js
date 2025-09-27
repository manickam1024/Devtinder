const express = require("express");
const router = express.Router();
const userAuth = require("../../middlewares/authentication");
require("../../schema/user"); // i import this becasue monggose doesnot know which model ur refering to while populating
const connSchema = require("../../schema/connectionSchema");

// GET all connections or pending reqestsent or requestrecieved for the logged-in user
router.get("/myconnections", userAuth, async (req, res) => {
  try {
    const userId = req.user._id; // from authentication middleware
    const connNames = [];

    const connList = await connSchema
      .find({
        $or: [{ fromid: userId }, { toid: userId }],
        status: "accepted",
      })
      .populate("toid", ["firstName", "lastName"]) // because i want to know whom im connected to not my own name
      .populate("fromid", ["firstName", "lastName"]);

    if (connList.length == 0) {
      res.json({ message: "no connections" });
    } else {
      //this is to just to identify whom im connected to and just sending thier names insted of sending whole document which contains my document and their document
      connList.map((e) => {
        if (e.fromid._id.toString() == userId.toString()) {
          // must toString() because without to string u are comparing the object which is always different
          connNames.push(e.toid.firstName + " " + e.toid.lastName);
        } else {
          connNames.push(e.fromid.firstName + " " + e.fromid.lastName + ",");
        }
      });
      res.json({ connNames: connNames });
    }
  } catch (err) {
    console.error(
      "at reqlist.js/myconnection error fetching connections:",
      err
    );
    res.status(500).send("Server error");
  }
});

router.get("/sent", userAuth, async (req, res) => {
  try {
    const userId = req.user._id; // from authentication middleware
    const connNames = [];

    const connList = await connSchema
      .find({
        fromid: userId,
        status: "interested",
      })
      .populate("toid", ["firstName", "lastName"]); // because i want to know whom im connected to not my own name

    if (connList.length == 0) {
      res.json({ message: "no requests sent" });
    } else {
      //this is to just to identify whom im connected to and just sending thier names insted of sending whole document which contains my document and their document
      connList.map((e) => {
        connNames.push(e.toid.firstName + " " + e.toid.lastName + ",");
      });
      res.json({ connectionNames: connNames });
    }
  } catch (err) {
    console.error("at reqlist.js/sent error fetching connections:", err);
    res.status(500).send("Server error");
  }
});

router.get("/received", userAuth, async (req, res) => {
  try {
    const userId = req.user._id; // from authentication middleware

    const connNames = [];

    const connList = await connSchema
      .find({
        toid: userId,
        status: "interested",
      })
      .populate("fromid", ["firstName", "lastName"]); // because i want to know whom im connected to not my own name

    if (connList.length == 0) {
      res.json({ message: "no requests received" });
    } else {
      //this is to just to identify whom im connected to and just sending thier names insted of sending whole document which contains my document and their document
      connList.map((e) => {
        connNames.push(e.fromid.firstName + " " + e.fromid.lastName);
      });
      res.json(connNames);
    }
  } catch (err) {
    console.error("at reqlist.js/received error fetching connections:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
