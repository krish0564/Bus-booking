const jwt = require("jsonwebtoken");

const generateTokenandCookies = (userId, userType, res) => {
  const token = jwt.sign({ userId, userType }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "None",
  });

  return token;
};

module.exports = generateTokenandCookies;
