const express = require('express');
const loginController = require('../controller/login');
const router = express.Router({mergeParams: true});
const authUtils = require('./authUtil');



router.post('/', async (req, res) => {
    if (req.user == null) {
        let results, errors = [];
        
        results = await loginController.getUserLoginInfoByName(req.body.username);
        
        
        try {
            if (results.length === 0) {
                errors.push(`No such user found`);
            }
        } catch (error) {
            return res.status(400).json({ error: 'An error occurred' });
        }
        
        
        //else {
            const flag = await loginController.chkCreds(req.body.username, req.body.password);
            if (flag == 1337) {
                console.log(`${req.body.username} ${results[0].TYPE} logged in successfully...`);
                await authUtils.loginUser(res, req.body.username, results[0].TYPE);

                // Send a JSON response indicating successful login
                return res.json({
                    message: 'Login successful',
                    userId: req.body.username,
                    userType: results[0].TYPE,
                });
                //return res.json({ message: 'Login successful' });
            } else {
                errors.push(`Invalid login`);
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
