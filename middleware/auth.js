const jwt = require("jsonwebtoken");
const config = require("../config/default");

module.exports = (req, res, next) => {
  // get token from header
  const token = req.header("x-auth-token");
  console.log(token);

  // check for no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.secretOrKey);

    console.log(decoded);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
