const router = require('express-promise-router')();
const {getAllStockSymbol,getAllStockDataBySymbol} = require('../controller/stock');

router.get('/',async (req, res,next) => {
    try{    const stocks = await getAllStockSymbol(req.query);
        // console.log(stocks)
        res.json(stocks)
    }catch (err) {
        console.log(err);
        next(err);
    }
});

router.get('/:symbol',async (req, res,next) => {
    try{
        const allInfo = await getAllStockDataBySymbol(req.params);
        res.json(allInfo);
    }catch (err) {
        console.log(err);
        next(err);
    }
});


module.exports = router;