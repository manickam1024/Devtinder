const express = require("express");
const router = express.Router();
const { User } = require("../../schema/user"); // this is the instance of the model which contains the schema using this instnace we insert the data

router.post("/sent/intrested", () => {});
router.post("/sent/notintrested", () => {});
router.post("/review/accepted", () => {}); // the requests i have got from other users
router.post("/review/rejected", () => {});

module.exports = router;
