const router = require('express-promise-router')();
import custController from '../controller/customer';

router.get('/',(req, res) => {
    const type = req.params.TYPE;
    console.log(type);
    console.log(req.params);
});

router.get('/portfolio',[
    body('userId').notEmpty().withMessage('userId is required'),
],async (req, res,next) => {
    try{
        const result = await custController.getPortfolioInfoByID(req.body.userId);
        if(result == null){
            console.log(`${req.body.userId} has no portfolio`);
        }
        else res.json(result);

    }catch(err){
        console.log(`Found ${err.message} in while getting portfolio..`);
        next(err);
    }
})

router.use('/logout',require('./logout').default);
