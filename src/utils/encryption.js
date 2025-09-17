const bcrypt = require("bcrypt");
const npmvalidator = require("validator");

const encryption = async (password, res) => {
  if (!npmvalidator.isStrongPassword(password)) {
    // npm to check if the password is strong
    res.send("enter a strong password");
  } else {
    const hashed = await bcrypt.hash(password, 10); // if its strong enough then hash it
    return hashed;
  }
};

module.exports = encryption;
