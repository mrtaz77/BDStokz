const router = require('express-promise-router')();
const {getUpcomingActivities} = require('../controller/activity');


router.get('/',async (req, res) => {
    const activities = await getUpcomingActivities(req.query);
    res.json(activities);
});

module.exports = router;