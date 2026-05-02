const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) return res.status(401).json({ msg: "No token" });
    if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded;
    next();
  } catch {
      console.log("JWT ERROR:", err.message); 
    res.status(401).json({ msg: "Invalid token" });
  }
};