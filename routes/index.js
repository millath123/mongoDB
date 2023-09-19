const express = require('express');
const router = express.Router();
const isAuthenticated = require('../auth');
const User = require('../model/usermodel'); 
const bcrypt = require('bcrypt');


// Define routes and middleware as needed

router.get('/', isAuthenticated, (req, res) => {
  res.render('index', { user: req.user });
});

router.put('/login',(req,res)=>{
  res.redirect('/login');
})

router.get('/logout', (req, res) => {
  res.clearCookie('session');

  res.redirect('/login');
  res.send('Logout successful');
});

router.get('/deleteaccount', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id; 
    await User.findByIdAndDelete(userId);
    res.clearCookie('session');
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/updatepassword', isAuthenticated, async (req, res) => {
  try {
      const userId = req.user._id;
      const oldPassword = req.body.oldPassword;
      const newPassword = req.body.newPassword;

      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).send('User not found');

      }

      // Check if the old password matches the stored hashed password
      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
          return res.status(400).redirect('/')
      }

      // Hash the new password and update it
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      const ok = await user.save();
      if(ok){
        return res.status(400).redirect('/login')
      }
     
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

module.exports = router;