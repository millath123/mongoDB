var express = require('express');
var router = express.Router();
const fs = require('fs');
// const mongoose = require('mongoose');
const User = require('../model/usermodel');
const bcrypt = require('bcrypt');


router.get('/', (req, res) => {
  res.render('signup');
});

router.post('/', async (req, res) => {
  const { name, email, password, repassword } = req.body;

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);


  try {

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Email is already in use, send a message to the user
      return res.status(400).send('Email is already in use. Please use a different email.');
    }
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving user to the database');
  }
});

module.exports = router;
