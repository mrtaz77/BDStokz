const router = require('express-promise-router')();
const custController =  require('../controller/customer');
const userController = require('../controller/user');
const { body } = require('express-validator');


router.get('/',(req, res) => {
    const type = req.params.TYPE;
    console.log(type);
    console.log(req.params);
});

router.get('/portfolio',async (req, res,next) => {
    try{
        const userId = req.query.userId; // Use req.query to get query parameters
        console.log(userId);

        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }
        const result = await custController.getPortfolioInfoByID(userId);
        if(result == null){
            console.log(`${userId} has no portfolio`);
        }
        else res.json(result);

    }catch(err){
        console.log(`Found ${err.message} in while getting portfolio..`);
        next(err);
    }
})

router.get('/isPremium', async (req, res) => {
    try{
        const userId = req.query.userId; // Use req.query to get query parameters
        console.log(userId);

        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        const result = await userController.isPrem(userId);
        let message;

        if (result === 'T') {
            message = 'Premium User';
        } else if (result === 'F') {
            message = 'Not a Premium User';
        } else if (result === 'N') {
            message = 'Not a Registered User';
        } else {
            message = 'Unknown Status';
        }

        console.log(result);
        res.json({ result, message });
    }catch(err){
        console.log(`Found ${err.message} in while getting premium status..`);
        next(err);
    }
});

router.use('/logout',require('./logout'));

module.exports = router;