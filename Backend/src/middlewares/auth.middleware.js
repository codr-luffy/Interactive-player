const jwt = require("jsonwebtoken");
const redis = require("../config/cache.js");

async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: " Token Not PRovided",
    });
  }

  const isTokenBlackListed = await redis.get(token);

  if (isTokenBlackListed) {
    return res.status(401).json({
      message: "Don't have a valid token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
}

module.exports = { authUser };
