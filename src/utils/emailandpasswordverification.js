const { User } = require("../schema/user");
const bcrypt = require("bcrypt");

const emailandpassverification = async (email, password) => {
  try {
    const document = await User.findOne({ email }); // finding wheather my email exists in the db or not if yes return the document
    if (!document) {
      return res.send("invalid credentials"); // instead of if else if use return to stop the execution
    }

    const isverifedUser = await bcrypt.compare(password, document.password);
    if (!isverifedUser) {
      return res.send("invalid credentials"); // im not exposing which one is wrong to prevent data breach /leak
    }
    const token = await document.jwtCreation(); // creating the token if the user is authenticated
    return token;
  } catch (err) {
    res.status(400).send("invlid crendentials");
  }
};
module.exports = emailandpassverification;
