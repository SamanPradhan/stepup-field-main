const jwt = require("jsonwebtoken");

const { redisClient } = require("../helpers/redis");
require("dotenv").config();
const authentication = async (req, res, next) => {
  console.log(req.body);
  // console.log(req.body.cookie);
  return;
  // const token = req.headers.authorization || req.cookie.stepupAccessToken;
  const { stepupAccessToken, stepupRefreshToken } = req.cookie;
  if (!stepupAccessToken) {
    return res.status(400).send({ msg: "invalid token" });
  }

  const tokenData = await jwt.verify(stepupAccessToken, process.env.JWT_secret);

  if (!tokenData) {
    return res.status(400).send({ msg: "authentication failed" });
  }

  const isTokenBlacklist = await redisClient.get(token);

  if (isTokenBlacklist) {
    return res.status(400).send({ msg: "token blacklisted" });
  }

  req.body.userID = tokenData.userID;

  console.log(req.body);

  next();
};
module.exports = { authentication };
