const express = require('express');
const router = express.Router({mergeParams: true});

const port = process.env.PORT || 3000;


router.post('/', async (req, res) => {
    res.clearCookie("userSessionToken");
    console.log("Logged out successfully");
});

module.exports = router;