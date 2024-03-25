const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { authenticate } = require("../middleware/authenticate");

require("../db/conn");
const User = require("../model/userSchema");
const { register, login } = require("../controller/authController");

router.get("/", (req, res) => {
  res.send(`Hello world from the server rotuer js`);
});

router.post("/register", register);

// login
router.post("/signin", login);

// about us page
router.get("/about", authenticate, (req, res) => {
  console.log(`Hello my About`);
  res.send(req.rootUser);
});

// get user data for cintact us and home page
router.get("/getdata", authenticate, (req, res) => {
  console.log(`Hello my About`);
  res.send(req.rootUser);
});

/// contact us page
router.post("/contact", authenticate, async (req, res) => {
  try {
    // Assuming you have middleware to authenticate the user, and the user details are available in req.user

    // Get the form data from the request body
    const { name, email, phone, message } = req.body; // object destructuring

    // Check if any of the required fields are empty
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: "Please fill in all the fields" });
    }

    const userContact = await User.findOne({ _id: req.userID });

    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );

      await userContact.save();

      res.status(201).json({ message: "Contact form submitted successfully" });
    }

    // Create a new contact object
    // const newContact = {
    //   name: name,
    //   email: email,
    //   phone: phone,
    //   message: message
    // };

    // Push the contact object to the user's contacts array
    // req.user.contacts.push(newContact);

    // Save the updated user data
    // await req.user.save();

    // Send a success response
    // res.status(200).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    // Handle errors
    console.error("Error submitting contact form:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.post("/addPet", authenticate, isAdmin, async (req, res) => {});
// logout us page
router.get("/logout", (req, res) => {
  console.log(`Hello my logout page`);
  res.clearCookie("jwtoken", { path: "/login" });
  res.status(200).send("user successfully logges out");
});

module.exports = router;
