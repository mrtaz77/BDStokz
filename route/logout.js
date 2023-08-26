const express = require('express');
const router = express.Router({mergeParams: true});

const port = process.env.PORT || 3000;


router.post('/', async (req, res) => {
    res.clearCookie("userSessionToken");
    res.redirect(`http/localhost:${port}/login`);
    console.log("Logged out successfully");
});

module.exports = router;