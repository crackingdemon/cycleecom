const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();
const fs = require('fs');
const { use } = require("../routers/users");
var products = JSON.parse(fs.readFileSync('./products.json', 'utf8'));

// Register

exports.create = async (req, res) => {
    try{
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
      res.send(err);
    }
  
  };

//   login 

exports.login = async(req, res)=>{
    try{
      const user = await User.findOne({email: req.body.email});
     
      if (!user) return res.status(400).send('Invalid username or password.');
  
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) return res.status(400).send('Invalid username or password 1.');
  
      // const accesToken = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.SECRET_KEY, {expiresIn: "3d"});
  
      // const {password, ...others} = user._doc;

      // res.status(200).send({...others, accesToken});

      // const token = await useremail.generateAuthToken();
      // res.cookie('jwt', token, {
      //  expires:new Date(Date.now() + 600000),
      //  httpOnly:true
      // })
      

      res.status(201).redirect('/');


  //     const email =req.body.email;
  //     const password =req.body.password;

  //    const useremail = await Register.findOne({email:email})

  //    const isMatch = await bcrypt.compare(password, useremail.password);

   
     
  //    if (isMatch) {
  //     res.status(201).render("home", { products });
  //    }else{
  //     res.send('incorrect password');
  //    }
  
   
    }catch(err){
      res.status(500).send(err.message);
    }
  
  };