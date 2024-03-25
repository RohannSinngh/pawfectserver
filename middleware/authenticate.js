const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const authenticate = async (req, res, next) => {
  try {
    // Check if 'jwtoken' cookie exists
    if (!req.cookies || !req.cookies.jwtoken) {
      return res.status(401).send("Unauthorized: No token provided");
    }

    const token = req.cookies.jwtoken; // Get token from cookies

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (err) {
    res.status(401).send("Unauthorized: Invalid token");
    console.log(err);
  }
};

const isAdmin = async (req, res, next) => {
  const roles = await Role.find({ _id: { $in: req.user.roles } });
  //   console.log(req.user.roles);
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "admin") {
      next();
      return;
    }
  }
  res.status(403).send({ message: "Requre Admin Role!" });
};

module.exports = { authenticate, isAdmin };
