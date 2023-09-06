const router = require('express-promise-router')();
const { body, validationResult } = require('express-validator');
const {
    getAllOrders,
    getOrderDetailsById,
    getAllOrdersByType,
    placeOrder,
    setBuyOrderStatus,
    sellOrderSuccess,
    getUserOrdersByType
} = require('../controller/order');

router.get('/allOrders/:n',async (req,res,next) => {
    try{
        const { n } = req.params;
        const orders = await getAllOrders(req.params.n);

        if (!orders || orders.length === 0) {
            // If no orders are found, send a 404 response
            return res.status(404).json({ error: 'No orders found' });
        }
    
        // Send a success response with the orders
        res.status(200).json(orders);
    } catch (error) {
        // Handle errors here
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' }); // Send an appropriate error response
        next(error);
    }
})

router.get('/orderTypes', async (req, res) => {
    try {
        const { n, type } = req.query;
        // Call your controller function to get orders by type
        const orders = await getAllOrdersByType(req.query);
    
        if (!orders || orders.length === 0) {
            // If no orders are found, send a 404 response
            return res.status(404).json({ error: 'No orders found' });
        }
    
        // Send a success response with the orders
        res.status(200).json(orders);
        } catch (error) {
        // Handle errors here
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' }); // Send an appropriate error response
        next(error);
    }
});

router.get('/userOrders', async (req, res) => {
    try {
        // Call your controller function to get user orders by type
        const userOrders = await getUserOrdersByType(req.query);
    
        if (!userOrders || userOrders.length === 0) {
            // If no user orders are found, send a 404 response
            return res.status(404).json({ error: 'No user orders found' });
        }
    
        // Send a success response with the user orders
        res.status(200).json(userOrders);
    } catch (error) {
      // Handle errors here
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' }); // Send an appropriate error response
    }
});


router.post('/placeOrder', [
    body('symbol').notEmpty().withMessage('Symbol is required'),
    body('userId').notEmpty().withMessage('User ID is required'),
    body('type').notEmpty().withMessage('Order type is required'),
    body('price').notEmpty().withMessage('Price is required'),
    body('quantity').notEmpty().withMessage('Quantity is required'),
    body('stop_price').notEmpty().withMessage('Stop price is required')
], async (req, res) => {
    try {
      // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        // Call your controller function to place the order
        const result = await placeOrder(req.body);

        // Handle the result accordingly (e.g., send a success or error response)
        if (result != null) {
            res.status(201).json({ message: 'Order placed successfully', order: result.order });
        } else {
            res.status(400).json({ error: `Order was not placed` });
        }
    } catch (error) {
        // Handle errors here
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' }); // Send an appropriate error response
    }
});

router.put('/set-buy-order-status', async (req, res) => {
    try {
            // Validate required request parameters
            if (!req.body.corpId || !req.body.orderId || !req.body.status) {
                return res.status(400).json({ error: 'Corp ID, Order ID, and status are required' });
            }

            // Call your controller function to set buy order status
            const result = await setBuyOrderStatus(req.body);
    
            // Handle the result accordingly
            if (result != null) {
                res.status(200).json({ message: 'Buy order status updated successfully' });
            } else {
                res.status(400).json({ error: `Error during status update of order ${req.body.orderId}` });
            }
        } catch (error) {
        // Handle errors here
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.put('/sell-order-success', async (req, res) => {
    try {
        // Validate required request parameters
        if (!req.body.orderId || !req.body.buyerId) {
            return res.status(400).json({ error: 'Order ID and buyer ID are required' });
        }
    
    
        // Call your controller function to mark the sell order as successful
        const result = await sellOrderSuccess(req.body);
    
        // Handle the result accordingly
        if (result != null) {
            res.status(200).json({ message: 'Sell order successful' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
    // Handle errors here
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});





module.exports = router;