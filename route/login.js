const express = require('express');
const loginController = require('../controller/login');
const router = express.Router({mergeParams: true});
const authUtils = require('./authUtil');

router.get('/', (req,res) => {
    if(req.user === null){
        const errors = [];
        // 
        
        // 
    }else {
        console.log(`${req.user.name} logged`);
    }
});

router.post('/', async (req, res) => {
    if (req.user == null){
        let results, errors = [];
        // get login info for handle (id, handle, password)
        results = await loginController.getUserLoginInfoByName(req.body.name);
        console.log(`Got results in login router`);

        if(results.length === 0){
            errors.push(`No such user found`);
        }
        else{
            const flag = await loginController.chkCreds(req.body.name,req.body.password);
            if (flag == 1337){
                console.log(`${req.body.name} logged in successfully...`);
                await authUtils.loginUser(res,req.body.name);
            }else {
                errors.push(`Invalid login`);
            }
        }   

        // if any error, redirect to login page but with form information, else redirect to homepage
        if (errors.length == 0) {
            console.log(`No error found , continuing to dashboard...`);
            // console.log(`/user/${results[0].TYPE}`);
            res.json(results);
            
            // res.redirect(`/user/${results[0].TYPE}`);
        } 

    }
});



module.exports = router;