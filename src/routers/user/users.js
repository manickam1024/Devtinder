const express = require("express");
const router = express.Router();
const { User } = require("../../schema/user"); // this is the instance of the model which contains the schema using this instnace we insert the data

router.get("/myconnections", () => {}); // the mutual connections
router.get("/requests", () => {}); // the requests i have sent to other users
router.get("/feed", () => {}); // the core feed

module.exports = router;
