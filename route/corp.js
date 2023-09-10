const router = require('express-promise-router')();
const { body } = require('express-validator');
const {
    regStock,
    getCorporationErrors
} = require('../controller/corporation');

router.post('/regStock',[
    body('corpId').notEmpty().withMessage('corpId is required'),
    body('symbol').notEmpty().withMessage('symbol of new stock is required'),
    body('price').notEmpty().withMessage('price of new stock is required'),
    body('available_lots').notEmpty().withMessage('available lots of new stock is required'),
    body('lot').notEmpty().withMessage('lot of new stock is required'),
],async(req, res, next) => {
    try{

        const stock = await regStock(req.body);

        if(stock === null){
            const errors = getCorporationErrors();
            return res.status(400).json({message:`Your stock ${req.body.symbol} could not be registered`,errors:errors});
        }

        res.status(200).json({message:`Your stock ${req.body.symbol} has been registered`,stock:stock});

    }catch(error){
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' }); // Send an appropriate error response
    }
})

module.exports = router;