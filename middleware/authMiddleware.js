const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).send({
      error: "access denied",
    });
  }
  try {
    const decoded = jwt.verify(token, "secret");
    req.decodedUser = decoded;
    next();
  } catch (e) {
    res.status(401).send({
      error: "Invalid token",
    });
  }
};

module.exports = verifyToken;
