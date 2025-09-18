const { User } = require("../schema/user");

const emailandpassverification = async (email, password) => {
  const document = await User.findOne({ email }); // finding wheather my email exists in the db or not if yes return the document
  if (!document) {
    return res.send("invalid credentials"); // instead of if else if use return to stop the execution
  }

  const isverifedUser = await document.passwordVerification(password);
  if (!isverifedUser) {
    return res.send("invalid credentials"); // im not exposing which one is wrong to prevent data breach /leak
  }
  const token = await document.jwtCreation(); // creating the token if the user is authenticated
  return token;
};

module.exports = emailandpassverification;
