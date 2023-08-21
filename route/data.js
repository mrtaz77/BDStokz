const router = require('express-promise-router')();
const getData = require('../controller/get-data');

router.get('/',async (req, res,next) => {
    try{
        const stocks = await getData(req.query);
        console.log(stocks)
        res.json(stocks)
    }catch(err){
        console.log(err)
        next(err)
    }
});

module.exports = router;