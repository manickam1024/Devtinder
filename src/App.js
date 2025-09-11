const express = require("express");

const app = express();

app.use(express.text());
app.use(express.json());

app.use(
  "/login/profile",
  (req, res, next) => {
    // res.send("profile page");
    next();
  },
  (req, res, next) => {
    // res.send("profile page 2");
    next();
  },
  (req, res, next) => {
    // res.send("profile page 3");
    next();
  },
  (req, res, next) => {
    // res.send("profile page 4");
    next();
  },
);

app.use("/login", (req, res) => {
  res.send(" the login page");
});

app.post("/sendform", (req, res) => {
  res.send("this is the body u sent " + req.body);
  res.end("promise resolved");
});
app.use("/", (req, res, next) => {
  // res.send(" home page ");
  next();
});
app.listen(4444, () => {
  console.log("server listening on 4444");
});
