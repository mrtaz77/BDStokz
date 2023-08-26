const router = require('express-promise-router')();

router.get('/',(req, res) => {
    const type = req.params.TYPE;
    console.log(type);
    console.log(req.params);
});

router.use('/logout',require('./logout'));
