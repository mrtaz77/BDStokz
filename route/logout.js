const express = require('express');
const router = express.Router({mergeParams: true});
const jwt = require('jsonwebtoken');
const {
    insertUserLog,
    insertAdminLog,
    getLogErrors
} = require('../controller/log');

router.post('/', async (req, res,next) => {
    try{
        const userSessionToken = req.cookies.userSessionToken;

        if (!userSessionToken) {
            // Handle the case where the session token is not found in the cookie.
            return res.status(400).json({ message: 'No session token found' });
        }
        const decodedToken = jwt.verify(userSessionToken, process.env.JWT_SECRET);

        const name = decodedToken.name;
        const userId = decodedToken.userId;
        
        let payload = {
            eventType : `Log out`,
            description : `${name} has logged out`
        }; 

        await insertAdminLog(payload);

        payload = {
            userId : userId,
            eventType : `Log out`,
            description : `You have logged out successfully`
        }

        await insertUserLog(payload);

        res.clearCookie("userSessionToken");
        
        res.status(200).json({ message: 'Logged out successfully' });
    }catch(err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;
