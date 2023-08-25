const express = require('express');
const userController = require('../controller/user');
const router = express.Router({mergeParams: true});
const authUtils = require('./authUtil');

router.get('/',(req,res)=>{
    if(req.user == null){
        res.redirect('/');
    }
    else{
        console.log(`${req.user.name} logged`);
        res.redirect('/user');
    }
});

router.post('/',async(req, res)=>{
    console.log(req.body);
    // check if already logged in
    if(req.user == null){
        let errors = [];
        console.log(`In reg router: ${req.body}`);
        const result = await userController.createUser(req.body);
        console.log(result.NAME);
        if(result == undefined){
            console.log(`Error creating new user...`);
            res.redirect('/');
        }else{  
            await authUtils.loginUser(res,result.NAME);
            res.redirect('/user');
        }
    }else{
        res.redirect('/user');
    }
});

module.exports = router;