const express = require("express");
const app = express(); // the above and this is to create the server and listenig at port 4444

const { connection } = require("./configurations/database"); //connection to the database

const User = require("./schema/user"); // this is the instance of the model which contains the schema using this instnace we insert the data
app.use(express.text());

app.use(express.json()); // this middleware parses the raw byyyytes into json

connection()
  .then(() => {
    console.log("connected");

    app.post("/login", async (req, res) => {
      // it wont be trigeered untill the user (post man u send post with data) request
      try {
        const name = req.body;
        const newuser = new User(name);
        const result = await newuser.save(); // adds id and __v (versions) of the document
        res.send(result);
      } catch (err) {
        console.log(err); // for async ops like .send()
      }
    });

    app.get("/getuser", async (req, res) => {
      const name = req.body.firstName;
      try {
        const result = await User.findOne({ firstName: name });
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    app.listen(4444, () => {
      console.log("server running at 4444");
    });
  })
  .catch((err) => {
    console.log("databse error" + err);
  });
