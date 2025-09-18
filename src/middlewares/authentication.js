const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token; // getting the cookie from the browser
    console.log("Token:", token);
    if (!token) {
      return res.status(401).send("Please login again");
    }
    // verify token (synchronous way) it returns the payload
    const parsedtoken = jwt.verify(token, "User@123");
    const id = parsedtoken.myid;
    req.id = id;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send("Invalid or expired token");
  }
};

module.exports = userAuth;
