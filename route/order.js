const router = require('express-promise-router')();
const { body, validationResult } = require('express-validator');
const {
    getAllOrders,
    getOrderDetailsById,
    getAllOrdersByType,
    placeOrder,
    setBuyOrderStatus,
    cancelOrder,
    sellOrderSuccess,
    getUserOrdersByType,
    getOrdersBySymbolAndType,
    updateOrder,
    getOrderErrors
} = require('../controller/order');

router.get('/allOrders',async (req,res,next) => {
    try{
        //const { n } = req.params;
        const orders = await getAllOrders();

        if (!orders || orders.length === 0) {
            // If no orders are found, send a 400 response
            return res.status(400).json({ error: 'No orders found' });
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
        const { type } = req.query;
        // Call your controller function to get orders by type
        const orders = await getAllOrdersByType(req.query);
    
        if (!orders || orders.length === 0) {
            // If no orders are found, send a 400 response
            return res.status(400).json({ error: 'No orders found' });
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
            
router.get('/symbol', async (req, res) => {
    try {
        const { symbol , type } = req.query;
        // Call your controller function to get orders by type
        const orders = await getOrdersBySymbolAndType(req.query);
    
        if (!orders || orders.length === 0) {
            // If no orders are found, send a 400 response
            return res.status(400).json({ error: 'No orders found for this symbol' });
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
            // If no user orders are found, send a 400 response
            return res.status(400).json({ error: 'No user orders found' });
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
    body('quantity').notEmpty().withMessage('Quantity is required')
    // body('stop_price').notEmpty().withMessage('Stop price is required')
], async (req, res) => {
    try {
      // Check for validation errors
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            const err = [];
            errors.array().forEach(element => {
                err.push(element.msg);
            });
        return res.status(400).json({ errors: err });
        }

        // Call your controller function to place the order
        const result = await placeOrder(req.body);

        // Handle the result accordingly (e.g., send a success or error response)
        if (result != null) {
            res.status(200).json({ message: 'Order placed successfully', order: result });
        } else {
            const errors = await getOrderErrors();
            errors.push(`Order was not placed`);
            res.status(400).json({ message: `Order was not placed`,errors:errors});
            //res.status(400).json({ errors: [`Order was not placed`] });
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
            const loc_err = await getOrderErrors();
            // Handle the result accordingly
            if (result != null) {
                res.status(200).json({ message: 'Buy order status updated successfully' });
            } else {
                loc_err.push(`Error during status update of order ${req.body.orderId}`);
                res.status(400).json({ errors: loc_err});
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
            return res.status(400).json({ errors: 'Order ID and buyer ID are required' });
        }


        // Call your controller function to mark the sell order as successful
        const result = await sellOrderSuccess(req.body);
        const loc_err = await getOrderErrors();
        // Handle the result accordingly
        if (result != null && result == 'SUCCESS') {
            res.status(200).json({ message: 'Sell order successful' });
        } else {
            res.status(400).json({ errors: loc_err });
        }
    } catch (error) {
        // Handle errors here
        console.error('Error:', error);
        res.status(500).json({ errors: 'An error occurred' });
    }
});

router.patch('/update',[
    body('userId').notEmpty().withMessage('User ID is required'),
    body('orderId').notEmpty().withMessage('Order ID is required'),
    body('price').notEmpty().withMessage('Price is required'),
    body('quantity').notEmpty().withMessage('Quantity is required')
], async (req, res) => {
    try {
      // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const err = [];
            errors.array().forEach(element => {
                err.push(element.msg);
            });
        return res.status(400).json({ errors: err });
        }
        // Call your controller function to place the order
        const result = await updateOrder(req.body);

        // Handle the result accordingly (e.g., send a success or error response)
        if (result != null) {
            res.status(200).json({ message: 'Order updated successfully', order: result.order });
        } else {
            const errors = await getOrderErrors();
            res.status(400).json({ message: 'Order was not updated',errors:errors});
        }
    } catch (error) {
        // Handle errors here
        console.error('Error:', error);
        res.status(500).json({ errors: ['An error occurred'] }); // Send an appropriate error response
    }
});

router.delete('/delete',[
    body('userId').notEmpty().withMessage('User ID is required'),
    body('orderId').notEmpty().withMessage('Order ID is required')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const err = [];
            errors.array().forEach(element => {
                err.push(element.msg);
            });
        return res.status(400).json({ errors: err });
        }

        // Call your controller function to place the order
        const result = await cancelOrder(req.body);

        // Handle the result accordingly (e.g., send a success or error response)
        if (result === `SUCCESS`) {
            res.status(200).json({ message: 'Order cancelled successfully', status: result });
        } else {
            const errors = await getOrderErrors();
            errors.push(`Order was not cancelled`);
            res.status(400).json({ message: `Order was not cancelled`,errors:errors});
            //res.status(400).json({ error: `Order was not cancelled` });
        }
    } catch (error) {
        // Handle errors here
        console.error('Error:', error);
        res.status(500).json({ errors: 'An error occurred' }); // Send an appropriate error response
    }
});

module.exports = router;


