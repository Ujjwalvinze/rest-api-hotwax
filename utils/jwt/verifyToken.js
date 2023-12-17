const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return false;
      }

      return decoded;
    });
  } catch (error) {
    console.log("Problem while verifying", error);
    return false;
  }
};

module.exports = verifyToken;
