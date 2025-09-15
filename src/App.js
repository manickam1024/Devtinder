const express = require("express");
const app = express(); // the above and this is to create the server and listenig at port 4444
const bcrypt = require("bcrypt");
const npmvalidator = require("validator");

const { connection } = require("./configurations/database"); //connection to the database

const User = require("./schema/user"); // this is the instance of the model which contains the schema using this instnace we insert the data
app.use(express.text());

app.use(express.json()); // this middleware parses the raw byyyytes into json

connection()
  .then(() => {
    console.log("connected");

    app.post("/register", async (req, res) => {
      // it wont be trigeered untill the user (post man u send post with data) request
      try {
        const { password, ...rest } = req.body;
        if (!npmvalidator.isStrongPassword(password)) {
          res.send("enter a strong password");
        } else {
          const hashed = (await bcrypt.hash(password, 10)).toString();
          const newuser = new User({ ...rest, password: hashed });

          const result = await newuser.save(); // adds id and __v (versions) of the document
          res.send(result);
        }
      } catch (err) {
        res.send("defined error " + err); // for async ops like .send()
      }
    });

    app.get("/getUser", async (req, res) => {
      try {
        const name = req.body.firstName;
        const user = await User.findOne({ firstName: name });
        res.send(user);
      } catch (err) {
        res.send("defined error " + err); // for async ops like .send()
      }
    });

    app.delete("/delete", async (req, res) => {
      try {
        const id = req.body._id;
        const settled = await User.findByIdAndDelete(id);
        res.send(settled + "  .................deleted");
      } catch (err) {
        res.send("defined error " + err); // for async ops like .send()
      }
    });

    app.delete("/deleteMany", async (req, res) => {
      try {
        const name = req.body.firstName;
        console.log(name);
        const settled = await User.deleteMany({ firstName: name });
        res.send(settled + "  .................deleted");
      } catch (err) {
        res.send("defined error " + err); // for async ops like .send()
      }
    });

    app.put("/updateEverything", async (req, res) => {
      try {
        const firstName = req.body.firstName;
        const newdata = req.body;

        const settled = await User.replaceOne(
          { firstName: firstName },
          newdata,
          {
            //here the leftout fields are written null
            new: true,
            overwrite: true,
            strict: false,
          },
        );
        res.send(settled + "  ...updated");
      } catch (err) {
        res.send("defined error " + err); // for async ops like .send()
      }
    });

    app.patch("/updatePart", async (req, res) => {
      try {
        const id = req.body._id;
        const newdata = req.body;
        const keyofschema = Object.keys(User.schema.paths);
        const filter = Object.keys(newdata).every((k) => {
          keyofschema.includes(k);
        });
        console.log(filter);

        if (filter) {
          const settled = await User.findByIdAndUpdate(id, newdata, {
            // here the leftout feilds are written with previous data because of no overwrite
            new: true,
            runValidators: true,
          });

          res.send(settled + "  ...updated");
        } else {
          res.send("invalid fields entered");
        }
      } catch (err) {
        res.send("defined error " + err); // for async ops like .send()
      }
    });

    app.head("/ping", (req, res) => {
      res.send();
      // No body, just headers + status
    });

    app.listen(4444, () => {
      console.log("server running at 4444");
    });
  })
  .catch((err) => {
    console.log("databse error" + err);
  });
