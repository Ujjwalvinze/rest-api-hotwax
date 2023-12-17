const jwt = require("jsonwebtoken");
require("dotenv").config();
const generateToken = (partyId) => {
  try {
    const token = jwt.sign({ partyId }, process.env.JWT_SECRET, {
      expiresIn: "10D",
    });
    return token;
  } catch (error) {
    console.log("Problem generating tokens", error);
    return false;
  }
};

module.exports = generateToken;
