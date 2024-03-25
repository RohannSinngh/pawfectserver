const Role = require("../model/roleSchema");
const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  // validation (no empty field)
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "missing entry" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    const role = await Role.findOne({ name: "user" });
    if (userExist) {
      return res.status(422).json({ error: "email already exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "no matching passwords" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });
      user.roles = [role._id];
      // yaha pe pre post bycryptic
      await user.save();

      res.status(201).json({ message: "user registered successfully" });
    }
  } catch (err) {
    console.log(err);
  }
};

const login = async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    // 3 validations..
    if (!email || !password) {
      // this jwt refers here
      return res.status(400).json({ error: "field empty details required" });
    }

    const userLogin = await User.findOne({ email: email });
    // console.log(userLogin);
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password); // pheele user ne jph data fill kiya voh aaega

      token = await userLogin.generateAuthToken(); //get karna hai yaha
      console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ message: "invalid credentials pass" });
      } else {
        res.json({ message: "signin successfull" });
      }
    } else {
      res.status(400).json({ message: "invalid credentials" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { login, register };
