const router = require('express-promise-router')();
const adminController = require('../controller/admin');
const orderController = require('../controller/order');
const { body } = require('express-validator');
const {
    getAllAdminLogs,
    getLogErrors,
} = require('../controller/log');

router.get('/log', async (req, res) => {
    try{
        console.log(req.query);
        const {adminId} = req.query;

        const logs = await getAllAdminLogs(adminId);

        if (!logs || logs.length === 0) {
            // If no logs are found, send a 400 response
            const errors = await getLogErrors();
            return res.status(400).json({ message: 'errors',err:errors});
        }

        res.status(200).json({message: 'Obtained logs',logs: logs});

    }catch(err){
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred' }); // Send an appropriate error response
    }
});

router.get('/backUpStock', async (req, res) => {
    try{
        console.log(req.query);

        const backUpStocks = await adminController.getBackUpStockOwns(req.query);

        if (!backUpStocks || backUpStocks.length === 0) {
            // If no logs are found, send a 400 response
            const errors = await adminController.getAdminErrors();
            return res.status(400).json({ message: 'errors',err:errors});
        }

        res.status(200).json(backUpStocks);

    }catch(err){
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred' }); // Send an appropriate error response
    }
});

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

        return res.status(200).json({message: `Successfully updated ${req.body.field} of ${req.body.symbol} to ${req.body.newValue}`,result : result});

    }catch (err) {
        console.log(err);
        next(err);
    }
})

router.patch('/block/:set',[
    body('symbol').notEmpty().withMessage('symbol is required'),
],async (req, res,next) => {
    console.log(`Requesting block ${req.body.symbol} and ${req.params.set}`);
    try{
        const result = await adminController.block(req.params.set, req.body);
        console.log(result);

        if(result !== req.params.set){
            const errors = await adminController.getAdminErrors();
            return res.status(400).json({ message: `${req.body.symbol} status not updated`,errors: errors });
        }else{
            return res.status(200).json({message: `${req.body.symbol} status set successfully`});
        }
    }catch (err) {
        console.log(err);
        next(err);
    }
});

router.delete('/deleteUser',[
    body('userId').notEmpty().withMessage('name to be deleted is required'),
    body('deleterId').notEmpty().withMessage('deleterId is required'),
    body('password').notEmpty().withMessage('pwd is required for deleting user')
],async (req,res,next)=>{
    try{
        const result = await adminController.deleteUser(req.body);
        if(result === null){
            
            return res.status(200).json({ message: 'User deleted successfully'});
        }
        else{
            const errors = await adminController.getAdminErrors();
            return res.status(400).json({ message: 'Deletion unsuccessfull',errors: errors });
        }
    }catch (error) {
        res.status(500).json({ error: `An error occurred ${error}` }); // Send an appropriate error response
        next(error);
    }
});

router.get('/dailyProfit',async (req,res,next) => {
    try{    
        const dailyProfit = await adminController.getDailyProfit();
        // console.log(dailyProfit);
        return res.status(200).json(dailyProfit);
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
        return res.json(employeeNames);
    }catch (err) {
        console.log(err);
        next(err);
    }
});

router.get('/empDetails/:name',async (req,res,next)=>{  
    try{
        const encodedName = req.params.name;
        const name = decodeURIComponent(encodedName);
        console.log(name);

        const empDetails = await adminController.getAllEmployeeDetailsByFullname(name);
        if(empDetails == null){
            return res.status(400).json({ message: 'employee not found' });
        }
        return res.status(200).json(empDetails);
    }catch (err) {
        console.log(err);
        next(err);
    }
});

router.get('/allUsers',async (_req,res,next)=>{
    try{
        const users = await adminController.getAllUserNameAndType();   
        if(users == null){
            return res.status(400).json({ message: 'users not found' });
        }
        return res.json(users);
    }catch (err) {
        console.log(err);
        next(err);
    }
});

router.get('/allOrders',async (_req,res,next)=>{
    try{
        const orders = await orderController.getAllOrders();   
        if(orders == null){
            return res.status(400).json({ message: 'orders not found' });
        }
        return res.json(orders);
    }catch (err) {
        console.log(err);
        next(err);
    }
});

router.post('/addAdmin',[
    body('adminId').notEmpty().withMessage('adminId is required'),
    body('empName').notEmpty().withMessage('empName of stock is required')
],async (req,res,next)=>{
    try{
        const result = await adminController.addAdmin(req.body);

        if (result === null) {
            console.log(`Error updating ${req.body.empName} as admin by ${req.body.adminId}`);
            const errors = await adminController.getAdminErrors();
            return res.status(400).json({ message: 'Error adding admin', errors:errors});
        }

        console.log(`Successfully added ${req.body.empName} as admin by ${req.body.adminId}`);
        res.status(200).json(result);

    }catch (err) {
        console.log(err);
        next(err);
    }
});

router.delete('/deleteOrder',[
    body('adminId').notEmpty().withMessage('adminId is required'),
    body('orderId').notEmpty().withMessage('orderId is required')
],async (req,res,next) => {
    try{
        const result = await adminController.deleteOrderPermanent(req.body);

        if(result === null){
            return res.status(200).json({ message: 'Order deleted successfully'});
        }
        else{
            return res.status(400).json({ message: 'Deletion unsuccessfull' });
        }

    }catch (err) {
        console.log(err);
        next(err);
    }

});

router.get('/log', async (req, res) => {
    try{
        console.log(req.query);
        const {adminId} = req.query;

        const logs = await getAllAdminLogs(adminId);

        if (!logs || logs.length === 0) {
            // If no logs are found, send a 400 response
            const errors = await getLogErrors();
            return res.status(400).json({ message: 'errors',err:errors});
        }

        res.status(200).json({message: 'Obtained logs',logs: logs});

    }catch(err){
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred' }); // Send an appropriate error response
    }
});

module.exports = router;