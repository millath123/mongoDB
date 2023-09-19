const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const log= require('../model/usermodel');
const cookie = require('cookie');
// Import your user model

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;

 
    try {
        // Save the user to MongoDB
        const savedUser = await log.findOne({ email: email });
       
        // check mail and passwords are equal
        if (savedUser) {
            const matchPass = await bcrypt.compare(password, savedUser.password);
            if (matchPass) {
                res.cookie('session',savedUser._id.toString());
                res.redirect('/');         
            }
            else {
                res.send('Wrong Password or EmailId')
            }
        }

        // Redirect to a thank you page or another appropriate page
    } catch (error) {
        // Handle any errors here
        console.error(error);
        res.status(500).send('Error saving user.');
    }
});


module.exports = router;