const jwt = require("jsonwebtoken");
const config = require("../util/keys").secret;
const userController = require("../controllers/userControls").refreshToken2;

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No Token, authorization denied" });
  }

  try {
    const decode = jwt.verify(token, config);
    req.user = decode;
    console.log(decode + "decode");
    return next();
  } catch (error) {
    const refreshToken = req.header("x-auth-refresh-token");
    // return console.log(refreshToken);
    if (refreshToken) {
      try {
        const decode2 = jwt.verify(refreshToken, config);
        const newToken = userController(refreshToken);
        console.log(newToken + "335351");
        if (newToken.token) {
          res.set("x-token", newToken.token);
        }
        req.user = decode2;
        next();
      } catch (error) {
        console.log("exp");
        res.status(400).json({ msg: "Token is not valid", error: error });
      }
    }
  }
}

module.exports = { auth: auth };
