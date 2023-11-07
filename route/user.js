const router = require('express-promise-router')();
const custController =  require('../controller/customer');
const userController = require('../controller/user');
const { body } = require('express-validator');

const {
    getUserLogsById,
    getLogErrors,
} = require('../controller/log');

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
        else res.json({data:result});

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

router.get('/profile/:name', async (req, res) => {
    const encodedName = req.params.name;
    const name = decodeURIComponent(encodedName);
    try {
        const userProfile = await userController.getProfileByName(name);

        if (userProfile === null) {
            // User not found
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json(userProfile);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/contact/:name', async (req, res) => {
    const encodedName = req.params.name;
    const name = decodeURIComponent(encodedName);


    try {
        const userContacts = await userController.getContactByName(name);

        if (userContacts === null) {
            // User not found
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(userContacts);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch('/updateProfile',[
    body('userId').notEmpty().withMessage('userId is required'),
    body('field').notEmpty().withMessage('field to be updated is required'),
    body('newValue').notEmpty().withMessage('newValue cannot be empty')
], async(req, res, next) => {
    try{
        const result = await userController.updateProfile(req.body);
        const error = await userController.getUserErrors();
        if (result === null) {
            console.log(`Error updating ${req.body.field} of user to ${req.body.newValue}`);
            return res.status(400).json({ message: 'Error updating user', errors:error});
        }

        console.log(`Successfully updated ${req.body.field} of user to ${req.body.newValue}`);
        res.status(200).json({ message: 'User info updated successfully' });

    }catch(error) {
        console.error(error);
        next(error);
    }
});

router.delete('/delContact', [
    body('userId').notEmpty().withMessage('userId is required'),
    body('contact').notEmpty().withMessage('contact to be deleted is required'),
], async (req, res, next) => {
    try {
        const result = await userController.deleteContact(req.body);

        if (result !== null) {
            const errs = await userController.getUserErrors();
            console.log(`Error deleting ${req.body.contact} of user ${req.body.userId}`);
            return res.status(400).json({ message: 'Error deleting contact', errors:errs});
        }

        console.log(`Successfully deleted ${req.body.contact} of user ${req.body.userId}`);
        res.status(200).json({ message: 'Contact deleted successfully' });

    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/addContact',[
    body('userId').notEmpty().withMessage('userId is required'),
    body('contact').notEmpty().withMessage('contact to be deleted is required')
],async(req, res,next) => {
    try{
        const result = await userController.addContact(req.body);

        if (result === null) {
            const errrs = await userController.getUserErrors();
            // console.log("got this errors...........");
            // console.log(errrs);
            console.log(`Error updating ${req.body.contact} of user ${req.body.userId}`);
            return res.status(400).json({ message: 'Error updating user', errors:errrs});
        }

        console.log(`Successfully updated ${req.body.contact} of user ${req.body.userId}`);
        res.status(200).json({ message: 'User info updated successfully' });

    }catch(error) {
        console.error(error);
        next(error);
    }
});
router.delete('/deleteAccount',[
    body('userId').notEmpty().withMessage('userId is required'),
    body('password').notEmpty().withMessage('password is required')
],async(req, res,next) => {
    try{
        const result = await userController.deleteAccount(req.body);

        if(result !== null){
            const errors = await userController.getUserErrors();
            res.status(400).json({ message: 'Account deletion unsuccessful',errors:errors});
        }

        else {
            res.status(200).json({ message: 'Account deleted successfully' });
        }
        

    }catch (error) {
        // Handle errors here
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' }); // Send an appropriate error response
        next(error);
    }
});


router.get('/log', async (req, res) => {
    try{
        const {userId} = req.query;

        const logs = await getUserLogsById(userId);

        if (!logs || logs.length === 0) {
            // If no logs are found, send a 400 response
            const errors = await getLogErrors();
            return res.status(400).json({ message: 'errors',err:errors});
        }

        res.status(200).json({message: 'Obtained logs',logs: logs});

    }catch(err){
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred' }); // Send an appropriate error response
    }
});

router.get('/owns', async (req, res) => {
    try{
        const {userId} = req.query;

        const owns = await userController.getOwnsInfoByUserId(userId);

        if (!owns || owns.length === 0) {
            // If no logs are found, send a 400 response
            const errors = await userController.getUserErrors();
            return res.status(400).json({ message: 'errors',err:errors});
        }

        res.status(200).json({message: 'Obtained owns',owns: owns});

    }catch(error){
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' }); // Send an appropriate error response
    }
});





router.use('/logout',require('./logout'));
router.use('/broker',require('./broker'));
router.use('/corp',require('./corp'));

module.exports = router;