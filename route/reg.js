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
    // check if already logged in
    if(req.user == null){
        //let errors = [];
        console.log(`In reg router: ${req.body}`);
        const result = await userController.createUser(req.body);
        // if(result == null){
        //     const errors = await userController.getErrors();
        //     res.status(200).json({ message: 'errors',err:errors});
        // }
        //console.log(result.NAME);
        if((result == null)||(result == undefined)){
            const errors = await userController.getErrors();
            res.status(400).json({ message: 'errors',err:errors});
            console.log(errors);
            console.log(`Error creating new user...`);
            //res.redirect('/');
        }else{  
            await authUtils.loginUser(res,result.NAME);
            res.status(200).json({ message: 'Registration data received successfully' });
            //res.redirect('/user');
        }
    }else{
        //res.redirect('/user');
    }
});

module.exports = router;