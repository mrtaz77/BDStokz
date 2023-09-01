const router = require('express-promise-router')();
const customerController = require('../controller/customer');
const { body } = require('express-validator');

router.post('/createPortfolio',[
    body('userId').notEmpty().withMessage('userId is required'),
    body('symbol').notEmpty().withMessage('sector is required'),
],async (req, res, next) => {
    try{
        const result = await customerController.createPortfolio(req.body);

        if(result == null){
            return res.status(400).json({ message: 'Portfolio creation unsuccessfull'});
        }

        return res.status(200).json({ message: 'Portfolio created successfully'});

    }catch (err) {
        console.error(err);
        next(err);
    }

});