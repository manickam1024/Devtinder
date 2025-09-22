const jwt = require("jsonwebtoken");
const { User } = require("../schema/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token; // getting the cookie from the browser
    if (!token) {
      return res.status(401).send("Please login again"); // if i dont have the token
    }
    // verify token (synchronous way) it returns the payload
    const parsedtoken = jwt.verify(token, "User@123");
    const id = parsedtoken.myid;
    // putting the id in req so that i can access it in the next middleware or route handler
    const user = await User.findById(id);
    if (!user) {
      console.log("User not found at userAuth");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send("Invalid or expired token"); //here i have the token but it is invalid
    console.log("error at authentication.js ");
  }
};

module.exports = userAuth;
