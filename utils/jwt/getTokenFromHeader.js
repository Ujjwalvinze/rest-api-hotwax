const getTokenFromHeader = (req) => {
  const headerObject = req.headers;
  const bearerToken = headerObject["authorization"];
  const token = bearerToken.split(" ")[1];

  if (token !== undefined) return token;

  return false;
};

module.exports = getTokenFromHeader;
