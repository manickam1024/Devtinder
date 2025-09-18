const { User } = require("../../src/schema/user");

const allowedUpdates = (req) => {
  const newdata = req.body;
  const excludeditems = ["email", "password"];
  const isAllowed = Object.keys(newdata).every((k) => {
    // here we r checking wheather the keys entered by the user are present in the schema or not. it returns true or false
    return !excludeditems.includes(k);
  });
  return isAllowed;
};

module.exports = allowedUpdates;
