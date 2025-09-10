const express = require("express");

const app = express();

app.use("/", (req, res, next) => {
  next();
});

app.get("/login", (req, res) => {
  res.send("this is the login page request");
});

app.listen(4444, () => {
  console.log("server listening on 4444");
});
