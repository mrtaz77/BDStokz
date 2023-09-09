const router = require('express-promise-router')();
const { body } = require('express-validator');
const {
    getUserLogsById,
    getAllAdminLogs,
    getLogErrors,
} = require('../controller/log');

router.get('/adminLogs', async (req, res) => {
    try{
        const {userId} = req.query;

        const logs = await getAllAdminLogs(userId);

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

router.get('/userLogs', async (req, res) => {
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

module.exports = router;