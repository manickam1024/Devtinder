// the below is to import and create the server and which is listening at port 4444
const express = require("express");
const app = express();

//connection to the database

const { connection } = require("./configurations/database");

// importing the routes
const registerandauth = require("./routers/user/userAuth");
const profile = require("./routers/user/profile");
const adminDelete = require("./routers/admin/deleteUser");
const connections = require("./routers/user/connections");
const request = require("./routers/user/reqlist");
const feed = require("./routers/user/feed");

// middlewares for parsing
const CookieParser = require("cookie-parser");
app.use(express.text());
app.use(express.json()); // this middleware parses the raw byyyytes into json
app.use(CookieParser());

connection()
  .then(() => {
    console.log("database is connected");

    app.use("/auth", registerandauth);
    app.use("/profile", profile);
    app.use("/admin", adminDelete);
    app.use("/connection", connections);
    app.use("/user", request);
    app.use("/home", feed);

    app.listen(4444, () => {
      console.log("server running at 4444");
    });
  })
  .catch((err) => {
    console.log("databse error at app.js " + err);
  });
