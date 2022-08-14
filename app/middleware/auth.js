const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  let token =
    req.token ||
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"] ||
    req.headers["Authorization"];
  console.log("authorization", req.headers);

  if (!token) {
    return res
      .status(403)
      .send(
        req.headers["Authorization"] + "A token is required for authentication"
      );
  }

  try {
    token = token.split(" ")[1];
    let secret = config.TOKEN_KEY;
    if (!secret) secret = "NMA8JPctFuna59f5";
    //const decoded = jwt.verify(token, text);
    const decoded = jwt.decode(token, secret, (algorithm = "HS512"));

    req.id = decoded.sub;
    console.log("req.id", req.id);
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
