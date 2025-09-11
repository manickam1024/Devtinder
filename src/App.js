const express = require("express");

const app = express();

const { adminauth } = require("./middlewares/authentication");

app.use("/admin", adminauth);

app.post("/admin/addmovie", (req, res) => {
  res.send(" movie succesfully added to the database ");
});

app.post("/admin/modifymovie", (req, res) => {
  res.send("movie is modified successfully");
});

app.post("/admin/deletemovie", (req, res) => {
  res.send("movie deleted  successfully");
});

app.listen(4444, () => {
  console.log("server running at 3000");
});
