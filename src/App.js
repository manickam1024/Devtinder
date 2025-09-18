const express = require("express");
const app = express(); // the above and this is to create the server and listenig at port 4444

const { connection } = require("./configurations/database"); //connection to the database

const { User } = require("./schema/user"); // this is the instance of the model which contains the schema using this instnace we insert the data
const encryption = require("./utils/encryption");
const bcrypt = require("bcrypt");
const CookieParser = require("cookie-parser");
const userAuth = require("./middlewares/authentication");

app.use(express.text());
app.use(express.json()); // this middleware parses the raw byyyytes into json
app.use(CookieParser());

connection()
  .then(() => {
    console.log("connected");

    app.post("/register", async (req, res) => {
      // it wont be trigeered untill the user (post man u send post with data) request
      try {
        const { password, ...rest } = req.body; // instead of destructing all the fields use ...rest
        const hashed = await encryption(password, res); // await because whever i call encryption interally a promise is called ,but js goes to execute next line
        const newuser = new User({ ...rest, password: hashed });
        const result = await newuser.save(); // inserts the document into db and adds id and __v (versions) of the document
        res.send(result);
      } catch (err) {
        res.send("defined error " + err); // for async ops like .send()
      }
    });
    app.post("/login", async (req, res) => {
      try {
        const { password, email } = req.body;
        if (!email || !password) {
          return res.send("email or password cannot be empty"); //authentication
        }
        const document = await User.findOne({ email }); // finding wheather my email exists in the db or not if yes return the document
        if (!document) {
          return res.send("invalid credentials"); // instead of if else if use return to stop the execution
        }

        const verifedUser = await document.passwordVerification(password); // this function returns promise
        if (!verifedUser) {
          return res.send("invalid credentials"); // im not exposing which one is wrong to prevent data breach /leak
        }
        const token = await document.jwtCreation(); // creating the token if the user is authenticated
        res.cookie("token", token); //creating and sending the cookie to browser
        res.send("logged in successfully");
      } catch (err) {
        res.send("defined error " + err);
      }
    });

    app.get("/profile", userAuth, async (req, res) => {
      try {
        const id = req.id; // coming from the middleware userAuth
        const user = await User.findOne({ _id: id });
        if (user) {
          res.send(user); //sending the user details to the user
        }
      } catch (err) {
        res.send("defined error " + err); // for async ops like .send(), jwt.verify is also async
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
            new: true,
            overwrite: true, //here the leftout fields are written null

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
          // here we r checking wheather the keys entered by the user are present in the schema or not. it returns true or false
          keyofschema.includes(k);
        });
        console.log(filter);

        if (filter) {
          const settled = await User.findByIdAndUpdate(id, newdata, {
            // here the leftout feilds are written with previous data because of no overwrite
            // the modifers are compared automatically only validators are explicitly mentioned
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
