const express = require('express');
const userController = require('../controller/user');
const router = express.Router({mergeParams: true});
const authUtils = require('./authUtil');

router.get('/',(req,res)=>{
    if(req.user != null){
        console.log(`${req.user.name} logged`);
    }
});

router.post('/',async(req, res)=>{
    console.log(req.body);
    // check if already logged in
    if(req.user == null){
        console.log(`In reg router: ${req.body}`);
        // check if already user exists 
        const result = await userController.createUser(req.body);
        if(result == null){
            console.log(`Error creating new user...`);
        }else{  
            await authUtils.loginUser(res,result.NAME);
        }
    }
});

module.exports = router;