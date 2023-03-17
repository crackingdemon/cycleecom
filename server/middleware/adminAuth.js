const User = require('../models/User');
const cookieParser = require('cookie-parser');
const express = require('express')
const app = express();
app.use(cookieParser());

const adminAuth = async (req, res, next)=>{

    try {
        
        const user_id = req.cookies.user_id;
        const user = await User.findOne({_id:user_id}).lean(true)  
         if(!user.isAdmin){
            res.redirect('/')
             return ;
         }

        next();

    } catch (error) {
        res.status(401).send(error);
        
    }

}

module.exports = adminAuth;