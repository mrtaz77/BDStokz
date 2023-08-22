const router = require('express-promise-router')();
const {getAllStockSymbol} = require('../controller/stock');

router.get('/',async (req, res) => {
    const stocks = await getAllStockSymbol(req.query);
    // console.log(stocks)
    res.json(stocks)
});

module.exports = router;