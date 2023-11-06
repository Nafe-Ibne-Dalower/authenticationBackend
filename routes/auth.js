const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fetchUser = require("../middlewares/fetchuser");
dotenv.config();

/**************************************/
// create a user using: post "/api/auth" . Doesn't require auth or login
router.post(
  "/register",
  [
    body("name", "Enter a valid name...").isLength({ min: 3 }),
    body("email", "Enter a valid email...").isEmail(),
    body("password", "Password must be 5 characters....").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // if there are no errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check whether the user exists or not
    try {
      let checkUser = await User.findOne({ email: req.body.email });
      if (checkUser) {
        return res
          .status(400)
          .send("Sorry a user with this email already exists...");
      }
      // hashing pass
      const setPass = await bcrypt.hash(req.body.password, 10);
      // creating user
      let user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: setPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      res.json({ "Your Auth Token": authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Something Went Wrong...");
    }
  }
);

/**************************************/
// For Authentication: Login Route
router.post(
  "/login",
  [
    body("email", "Authentication Error").isEmail(),
    body("password", "Password Can't be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // if there are no errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Authentication Error..." });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Authentication Error..." });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      res.json({ "Your Auth Token": authToken });
    } catch (error) {
      return res.status(400).json({ error: "Authenticaaation Error..." });
    }
  }
);

/**************************************/
// Getting LoggedIn User Details {Login Required}

router.post("/getuser", fetchUser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    return res.status(400).json({ error: "Authenticaaation Error..." });
  }
});
module.exports = router;
