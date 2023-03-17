const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { validateHeaderValue } = require('http');
const app = express();
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());



// Register
router.post("/register", async (req, res) => {
  try{

    let userr = await User.findOne({ email: req.body.email })
    if (userr) return res.status(400).send('user already registered!')

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
  
  


    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

      const savedUser = await newUser.save();
  
      res.status(201).redirect('/login');
  
    }catch(err){
      res.send(err.message);
    }
  
  });

// Login 
router.post('/login', async(req, res)=>{
  try{
    const user = await User.findOne({email: req.body.email});
    const user_id = user._id.toString()
    
   
    if (!user) return res.status(400).send('Invalid username or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid username or password.');


    res.cookie('user_id', user_id, {
      expires:new Date(Date.now() + 60000000),
      httpOnly:true
     })

    res.status(201).redirect('/');

 
  }catch(err){
    res.status(500).send(err.message);
  }

});


router.get('/logout' , async (req, res)=>{
  try {

      // for single logout
      // req.user.tokens = req.user.tokens.filter((currentElement)=>{
      //     return currentElement.token !== req.token
      // })
      res.clearCookie('user_id');

        // await req.user.save();

      res.redirect('/login');

  } catch (error) {
      res.status(500).send(error);
  }
})


module.exports = router;