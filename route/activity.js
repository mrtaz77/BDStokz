const router = require('express-promise-router')();
const {getUpcomingActivities,getActivityErrors} = require('../controller/activity');


router.get('/', async (req, res) => {
    try {
        const activities = await getUpcomingActivities(req.query);

        if (activities.length === 0) {
        // If no activities were found, respond with a 404 status code
            const errors = await getActivityErrors();
            res.status(400).json({ message: 'errors',err:errors});
            console.log(errors);
        }

        // Respond with a 200 OK status and the activities
        res.status(200).json(activities);
    } catch (error) {
        // Handle any errors that occur during the request
        res.status(500).json({ error: 'An error occurred while fetching activities' });
    }
});


router.use('/participate',require('./participate'));


module.exports = router;