//login & register
const express = require('express');

const router = express.Router();

const Profile = require('../../models/Profile');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const gravatar = require('gravatar');
 

//route GET api/users/test
router.get('/test', (req,res)=>{
    res.json("profile works");
});

//POST api/profiles/add
router.post('/add', passport.authenticate("jwt",{session:false}),(req,res)=>{
    
    const profileFields = {};
    if(req.body.type) profileFields.type = req.body.type;
    if(req.body.description) profileFields.description = req.body.description;
    if(req.body.income) profileFields.income = req.body.income;
    if(req.body.exchange) profileFields.exchange = req.body.exchange;
    if(req.body.cash) profileFields.cash = req.body.cash;
    if(req.body.remark) profileFields.remark = req.body.remark;

    new Profile(profileFields).save().then(profile=>{
        res.json(profile);
    });

});

//GET api/profiles/
router.get('/', passport.authenticate("jwt",{session:false}),(req,res)=>{
    
    Profile.find().then(profile=>{
        
        if(!profile){
            res.status(404).json('Not found');
        }
        res.json(profile);
    }).catch(error=>{
        res.status(404).json(error);
    });
});



//GET api/profiles/:id
router.get('/:id', passport.authenticate("jwt",{session:false}),(req,res)=>{
    
    Profile.findOne({_id:req.params.id}).then(profile=>{
        
        if(!profile){
            res.status(404).json('Not found');
        }
        res.json(profile);
    }).catch(error=>{
        res.status(404).json(error);
    });
    

});

//POST api/profiles/edit/:id
router.post('/edit/:id', passport.authenticate("jwt",{session:false}),(req,res)=>{
    
    const profileFields = {};
    if(req.body.type) profileFields.type = req.body.type;
    if(req.body.description) profileFields.description = req.body.description;
    if(req.body.income) profileFields.income = req.body.income;
    if(req.body.exchange) profileFields.exchange = req.body.exchange;
    if(req.body.cash) profileFields.cash = req.body.cash;
    if(req.body.remark) profileFields.remark = req.body.remark;

    Profile.findOneAndUpdate(
        {_id:req.params.id},
        {$set:profileFields},
        {new:true}).then(profile=>{
            res.json(profile)
        });

});

//POST api/profiles/delete/:id
router.post('/delete/:id', passport.authenticate("jwt",{session:false}),(req,res)=>{
    
    Profile.findOneAndRemove({_id:req.params.id}).then(profile=>{
        
        profile.save().then(profile=>{
            res.json(profile);
        });
    }).catch(error=>{
        res.status(404).json(error);
    });
    

});

module.exports = router;