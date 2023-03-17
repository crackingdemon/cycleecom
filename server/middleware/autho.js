const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cookieParser = require('cookie-parser');
const express = require('express')
const app = express();
app.use(cookieParser());

const auth = async (req, res, next)=>{
    try {
        const token = req.cookies.user_id;
        
        if(req.xhr){
            if (token===undefined){ res.status(200).send({
                "url" : "/login"
              })
            }
            // return;
        }else{
            if (token===undefined){ res.redirect('/login') }
        }

        const user = await User.findOne({_id:token}).lean(true)  
        if(!user) return ("Login First..");  

        next();
        
    } catch (error) {
        res.status(401).send(error);
    }
}


module.exports = auth;