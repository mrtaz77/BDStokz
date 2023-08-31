const router = require('express-promise-router')();
const adminController = require('../controller/admin');
const { body } = require('express-validator');

router.patch('/updateStock',[
    body('adminId').notEmpty().withMessage('adminId is required'),
    body('symbol').notEmpty().withMessage('symbol of stock is required'),
    body('field').notEmpty().withMessage('field to be updated is required'),
    body('newValue').notEmpty().withMessage('newValue cannot be empty')
], async(req, res, next) => {
    console.log(`Updating ${req.body.field} of ${req.body.symbol} to ${req.body.newValue}`);
    try{
        const result = await adminController.updateStock(req.body);

        if (result === null) {
            console.log(`Error updating ${req.body.field} of ${req.body.symbol} to ${req.body.newValue}`);
            return res.status(400).json({ message: 'Error updating stock' });
        }

        console.log(`Successfully updated ${req.body.field} of ${req.body.symbol} to ${req.body.newValue}`);
        res.json(result);
        res.json({ message: 'Stock updated successfully' });

    }catch (err) {
        console.log(err);
        next(err);
    }
})

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
    }catch (err) {
        console.log(err);
        next(err);
    }
});

router.delete('/deleteUser',[
    body('userId').notEmpty().withMessage('userId is required'),
    body('deleterId').notEmpty().withMessage('deleterId is required'),
    body('pwd').notEmpty().withMessage('pwd is required for deleting user')
],async (req,res,next)=>{
});

router.get('/dailyProfit',async (req,res,next) => {
    try{    
        const dailyProfit = await adminController.getDailyProfit();
        // console.log(dailyProfit);
        res.json(dailyProfit);
    }catch (err) {
        console.log(err);
        next(err);
    }
});

router.get('/allEmployees',async (req,res,next)=>{
    try{
        const employeeNames = await adminController.getAllEmployeeNames();   
        if(employeeNames == null){
            return res.status(400).json({ message: 'employees not found' });
        }
        else res.json(users);
    }catch (err) {
        console.log(err);
        next(err);
    }
});

router.get('/empDetails/:name',async (req,res,next)=>{  
    try{
        const empDetails = await adminController.getAllEmployeeDetailsByFullname(req.params.name);
        if(empDetails == null){
            return res.status(400).json({ message: 'employee not found' });
        }
        else res.json(empDetails);
    }catch (err) {
        console.log(err);
        next(err);
    }
});

router.get('/allUsers',async (req,res,next)=>{
    try{
        const users = await adminController.getAllUserNameAndType();   
        if(users == null){
            return res.status(400).json({ message: 'users not found' });
        }
        else res.json(users);
    }catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;