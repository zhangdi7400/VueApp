//login & register
const express = require('express');

const router = express.Router();

const User = require('../../models/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const gravatar = require('gravatar');
 

//route GET api/users/test
router.get('/test', (req,res)=>{
    res.json("login works");
});

router.post('/register', (req,res)=>{
   
    //check if the email exists
    User.findOne({
        email:req.body.email
    }).then( (user)=>{
        if(user){
            return res.status(400).json("This email address has been registered");
        } else{
            const avatar = gravatar.url(req.body.url, {s: '200', r: 'pg', d: 'mm'});
            const newUser = new User({
                name:req.body.name,
                email:req.body.email,
                avatar,
                password:req.body.password,
                identity:req.body.identity
            });
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save().then(user=>{
                        res.json(user);
        
                    }).catch( err => {
                        console.log(err);
                    });
                });
            });
            
        }
        
    });
});

//post api/users/login
router.post('/login', (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email})
    .then( user => {
        if(!user){
            return res.status(404).json("The user doesn't exist");
        } 

        //check password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(isMatch){
                    const rule = {
                        id:user.id,
                        name:user.name,
                        avatar:user.avatar,
                        identity:user.identity
                    };
                    jwt.sign(rule,keys.secretOrKey,{expiresIn:3600}, (err,token)=>{
                        if(err) throw err;
                        res.json({
                            success:true,
                            token:"Bearer "+ token
                        });
                    });
                    //res.json({msg:"You have successfully logged in"});
                } else {
                    return res.status(400).json('wrong password');
                }
            });
        
    });
});

//GET api/users/current
//return current user
//access Private
router.get('/current',passport.authenticate("jwt",{session:false}),(req,res)=>{
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email,
        identity:req.user.identity
    });
});




module.exports = router;