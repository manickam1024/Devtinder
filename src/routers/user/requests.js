const express = require("express");
const router = express.Router();
const userAuth= require("./authentication")
// this is the instance of the model which contains the schema using this instnace we insert the data
// const connections = require("../../schema/connectionSchema");
router.get("/myconnections", userAuth, (req, res) => {
//   const id = req.user;
//   const connectionlist = connections.find
// }); // the mutual connection
// router.get("/requests", () => {}); // the requests i have sent to other users
// router.get("/feed", () => {}); // the core feed

});

module.exports = router;
