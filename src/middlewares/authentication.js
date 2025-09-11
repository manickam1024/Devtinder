const adminauth = (req, res, next) => {
  const token = "100";
  const result = token === req.query.token;
  console.log(req.query.token);
  if (result) {
    next();
  } else {
    res.status(403).send("forbidden");
  }
};

module.exports = { adminauth };
