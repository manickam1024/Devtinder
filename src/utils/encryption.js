const bcrypt = require("bcrypt");
const npmvalidator = require("validator");

const encryption = async (password, res) => {
  if (!npmvalidator.isStrongPassword(password)) {
    res.send("enter a strong password");
  } else {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
  }
};

module.exports = encryption;
