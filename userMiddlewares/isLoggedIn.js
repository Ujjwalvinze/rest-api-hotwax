const getTokenFromHeader = require("../utils/jwt/getTokenFromHeader");
const verifyToken = require("../utils/jwt/verifyToken");

const isLoggedIn = (req, res, next) => {
  const token = getTokenFromHeader(req);
  const decodedUser = verifyToken(token);

  console.log(decodedUser);

  if (!decodedUser) {
    return res.json({ message: "Invalid / Expired token" });
  }

  next();
};

module.exports = isLoggedIn;
