const router = require('express-promise-router')();
const {getUpcomingActivities} = require('../controller/activity');


router.get('/',async (req, res) => {
    const activities = await getUpcomingActivities(req.query);
    res.json(activities);
});

router.use('/particapate',require('./particapate'));

module.exports = router;