const router = require('express-promise-router')();
const {
    getAllStockSymbol,
    getAllStockDataBySymbol, 
    getTopLoserGainer,
    getAnnualAvgPrice
} = require('../controller/stock');

router.get('/',async (req, res,next) => {
    try{    const stocks = await getAllStockSymbol(req.query);
        // console.log(stocks)
        res.json(stocks)
    }catch (err) {
        console.log(err);
        next(err);
    }
});

router.get('/dsex',async (req, res,next) => {
    try{    
        const dsex = await getAnnualAvgPrice(req.query);
        console.log(dsex)
        res.json(dsex)
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

router.get('/order/:order',async (req, res,next) => {
    try{
        const gainLose = await getTopLoserGainer(req.params);
        res.json(gainLose);
    }catch (err) {
        console.log(err);
        next(err);
    }
});


module.exports = router;
