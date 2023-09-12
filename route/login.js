const express = require('express');
const loginController = require('../controller/login');
const router = express.Router({mergeParams: true});
const authUtils = require('./authUtil');
const {
    insertUserLog,
    insertAdminLog,
    getLogErrors
} = require('../controller/log');


router.post('/', async (req, res) => {
    if (req.user == null) {
        let results, errors = [];
        
        results = await loginController.getUserLoginInfoByName(req.body.username);
        
        
        try {
            if (results.length === 0) {
                errors.push(`No such user found`);
            }
        } catch (error) {
            const payload = {
                eventType : `Failed login`,
                description : `${req.body.username} failed to login`
            };

            const result = await insertAdminLog(payload);

            return res.status(400).json({ error: 'An error occurred' ,notification : result});
        }
            
        
        
        //else {
            const flag = await loginController.chkCreds(req.body.username, req.body.password);
            if (flag == 1337) {
                console.log(`${req.body.username} ${results[0].TYPE} logged in successfully...`);
                let payload = {
                    name : results[0].NAME,
                    type : results[0].TYPE,
                    userId : results[0].USER_ID
                }
                
                await authUtils.loginUser(res, payload);

                // Send a JSON response indicating successful login
                payload = {
                    eventType : `Successful login`,
                    description : `${req.body.username} has logged in`
                };
    
                await insertAdminLog(payload);

                payload = {
                    userId : results[0].USER_ID,
                    eventType : `Successful login`,
                    description : `Congrats ${req.body.username} ! You ar now logged in.`
                };
    
                await insertUserLog(payload);



                return res.json({
                    message: 'Login successful',
                    userId: results[0].USER_ID,
                    userType: results[0].TYPE,
                });
                //return res.json({ message: 'Login successful' });
            } else {
                errors.push(`Invalid login`);
                const payload = {
                    eventType : `Failed login`,
                    description : `${req.body.username} failed to login`
                };
    
                await insertAdminLog(payload);
            }
       // }

        // If there are errors, send a JSON response with the errors
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
    } else {
        // Send a JSON response indicating the user is already logged in
        return res.json({ message: 'User is already logged in' });
    }
});

module.exports = router;