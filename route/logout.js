const express = require('express');
const router = express.Router({mergeParams: true});

router.post('/', async (req, res) => {
    res.clearCookie("userSessionToken");
    res.redirect('/login');
    console.log("Logged out successfully");
});

module.exports = router;