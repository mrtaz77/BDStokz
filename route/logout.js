const express = require('express');
const router = express.Router({mergeParams: true});

router.post('/', async (req, res) => {
    res.clearCookie("userSessionToken");
    res.status(200).json({ message: 'Logged out successfully' });
    //res.redirect('/login');
    //console.log();
});

module.exports = router;