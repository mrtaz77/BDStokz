const router = require('express-promise-router')();
const adminController = require('../controller/admin');
const { body } = require('express-validator');

// router.patch('/changePWD',[
//     body('userId').notEmpty().withMessage('userId is required'),
//     body('email').notEmpty().withMessage('email is required'),
// ], async(req, res, next) => {

// })

router.patch('/block/:set',[
    body('symbol').notEmpty().withMessage('userId is required'),
],async (req, res,next) => {
    console.log(`Requesting block ${req.body.symbol} and ${req.params.set}`);
    try{
        const result = await adminController.block(req.params.set, req.body);
        if(result == null){
            console.log(`${req.body.symbol} is not in db`);
        }else{
            console.log(`${req.body.symbol} status set successfully`);
        }
        res.json(result);
    }catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;