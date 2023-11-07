const router = require('express-promise-router')();
const brokerController = require('../controller/broker');
const { body } = require('express-validator');

router.get('/customers', async (req, res) => {
    try {
        const { id } = req.query;
        // Call your controller function to get orders by type
        const customers = await brokerController.getCustomersOfBroker(id);
    
        if (!customers || customers.length === 0) {
            // If no orders are found, send a 400 response
            const errors = await brokerController.getBrokerErrors();
            return res.status(400).json({ message: 'No customers found',err:errors});
        }
    
        // Send a success response with the orders
        res.status(200).json(customers);
    } catch (error) {
        // Handle errors here
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' }); // Send an appropriate error response
        next(error);
    }
});

router.get('/',async(req,res) => {
    try {
        // Call your controller function to get orders by type
        const brokers = await brokerController.getAllBrokers();
    
        if (!brokers || brokers.length === 0) {
            // If no orders are found, send a 400 response
            const errors = await brokerController.getBrokerErrors();
            return res.status(400).json({ message: 'No brokers found',err:errors});
        }
    
        // Send a success response with the orders
        res.status(200).json(brokers);
    } catch (error) {
        // Handle errors here
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' }); // Send an appropriate error response
        next(error);
    }
});


module.exports = router;
