const {execute} = require('../config/database');
const oracledb = require('oracledb');
const userController = require('./user');

const getAllOrders = async () => {
    try{
        const sql = `
        SELECT 
        ORDER_ID,
        SYMBOL,
        (SELECT NAME FROM "USER" WHERE "USER".USER_ID = "ORDER".USER_ID) NAME,
        "TYPE",
        STATUS,
        LATEST_QUANTITY,
        LATEST_PRICE,
        TRANSACTION_FEE,
        FORMAT_TIMESTAMP_ORDER(LATEST_UPDATE_TIME) LATEST_UPDATE_TIME,
        FORMAT_TIMESTAMP_ORDER(TRANSACTION_TIME) TRANSACTION_TIME,
        STOP_PRICE
        FROM "ORDER" 
        ORDER BY LATEST_UPDATE_TIME DESC
        `;

        const bind = {
        };

        const result = await execute(sql,bind);

        return result.rows;

    }catch (error) {
        console.error(`While getting orders`);
        return null;
    }
}

const getUserOrdersByType = async (payload) => {
    try{
        const userId = payload.userId;
        const type = payload.type;

        const sql = `
        SELECT 
            ORDER_ID,
            SYMBOL,
            STATUS,
            LATEST_QUANTITY,
            LATEST_PRICE,
            TRANSACTION_FEE,
            FORMAT_TIMESTAMP_ORDER(LATEST_UPDATE_TIME) LATEST_UPDATE_TIME,
            FORMAT_TIMESTAMP_ORDER(TRANSACTION_TIME) TRANSACTION_TIME,
            STOP_PRICE
            FROM "ORDER"  
            WHERE USER_ID = :userId AND "TYPE" = :type
            ORDER BY LATEST_UPDATE_TIME DESC
        `;

        const binds = {
            userId: userId,
            type: type
        };

        const result = await execute(sql, binds);

        return result.rows;

    }catch (error) {
        console.error(`While getting orders`);
        return null;
    }
}

const getAllOrdersByType = async (payload) => {
    try{
        // const n = payload.n || 30;
        const type = payload.type || 'SELL';

        const sql = `
        SELECT 
            ORDER_ID,
            SYMBOL,
            USER_ID,
            STATUS,
            LATEST_QUANTITY,
            LATEST_PRICE,
            TRANSACTION_FEE,
            FORMAT_TIMESTAMP_ORDER(LATEST_UPDATE_TIME),
            FORMAT_TIMESTAMP_ORDER(TRANSACTION_TIME),
            STOP_PRICE
            FROM "ORDER" 
            WHERE "TYPE" = :type
            ORDER BY LATEST_UPDATE_TIME DESC
            --FETCH FIRST :n ROWS ONLY
        `;

        const bind = {
            type : type
        };

        const result = await execute(sql,bind);

        return result.rows;

    }catch (error) {
        console.error(`While getting orders`);
        return null;
    }
}

const getOrderDetailsById = async (orderId) => {
    try{
        const sql = `
        SELECT 
            ORDER_ID,
            SYMBOL,
            USER_ID,
            "TYPE",
            STATUS,
            LATEST_QUANTITY,
            LATEST_PRICE,
            TRANSACTION_FEE,
            FORMAT_TIMESTAMP_ORDER(LATEST_UPDATE_TIME) LATEST_UPDATE_TIME,
            FORMAT_TIMESTAMP_ORDER(TRANSACTION_TIME) TRANSACTION_TIME,
            STOP_PRICE
            FROM "ORDER"  
            WHERE ORDER_ID = :orderId
            ORDER BY LATEST_UPDATE_TIME DESC
        `;

        const binds = {
            orderId: orderId
        };

        const result = await execute(sql,binds);

        return result.rows[0];

    }catch (error) {
        console.error(`While getting order details of ${orderId}`);
        return null;
    }
}

const placeOrder = async (payload) => {
    try{
        const sql = `
        INSERT INTO "ORDER"(SYMBOL, USER_ID, "TYPE", LATEST_PRICE, LATEST_QUANTITY, STOP_PRICE)
        VALUES (:symbol, :userId, :type, :price, :quantity, :stop_price)
        RETURNING ORDER_ID INTO :orderId
        `;

        const type = payload.type;

        const binds = {
            symbol : payload.symbol,
            userId : payload.userId,
            type : type,
            price : payload.price,
            quantity : payload.quantity,
            stop_price : payload.stop_price,
            orderId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }
        

        if(!(type === 'BUY' || type === 'SELL')){
            console.log(`Invalid type ${type}`);
            return null;
        }

        const result = await execute(sql, binds);

        // Now, result.outBinds.orderId contains the generated ORDER_ID
        const id = result.outBinds.orderId[0];

        // console.log(id);

        const order = await getOrderDetailsById(id);

        return order;

    }catch (error) {
        console.error(`While placing order details : ${error.message}`);
        return null;
    }
}

const updateOrder = async (payload) => {
    try{

        let order = await getOrderDetailsById(payload.orderId);

        const userId = order.USER_ID;

        if (userId !== payload.userId) {
            console.error(`Update Permission denied`);
            return null;
        }

        const sql = `
        UPDATE "ORDER"
        SET LATEST_PRICE = :price,LATEST_QUANTITY = :quantity,STOP_PRICE = :stop_price 
        WHERE "ORDER_ID" = :order_id
        `;



        const binds = {
            price : payload.price,
            quantity : payload.quantity,
            stop_price : payload.stop_price,
            orderId: payload.orderId
        }

        await execute(sql,binds);

        order = await getOrderDetailsById(id);

        return order;

    }catch (error) {
        console.error(`While updating order details : ${error.message}`);
        return null;
    }
}


const setBuyOrderStatus = async (payload) => {
    try{
        const corpId = payload.corpId;
        const orderId = payload.orderId;
        const status = payload.status;

        const corp = await userController.getUserById(corpId);

        if(corp.TYPE !== `Corp`){
            console.error(`Unauthorized user : permission denied...`);
            return null;
        }

        const order = await getOrderDetailsById(orderId);

        if(order === null || order.STATUS !== 'PENDING' || order.TYPE !== 'BUY'){
            // console.log('order.TYPE: ', order.TYPE);
            // console.log('order.STATUS: ', order.STATUS);
            // console.log('order: ', order);
            console.error(`Invalid order request`);
            return null;
        }


        const sql = `
        UPDATE "ORDER"
        SET STATUS = :status
        WHERE ORDER_ID = :orderId
        `;

        

        const binds = {
            orderId: orderId,
            status: status
        };


        await execute(sql,binds);

        const result = await getOrderDetailsById(orderId);

        return result.STATUS;

    }catch (error) {
        console.error(`While setting order status : ${error.message}`);
        return null;
    }
}

const sellOrderSuccess = async (payload) => {
    try{
        const orderId = payload.orderId;
        const buyerId = payload.buyerId;
        const order = await getOrderDetailsById(orderId);
        const user = await userController.getUserById(buyerId);

        if(order === null || order.STATUS !== 'PENDING' || order.TYPE !== 'SELL'){
            console.log('order.TYPE: ', order.TYPE);
            console.log('order.STATUS: ', order.STATUS);
            console.log('order: ', order);
            console.error(`Invalid order request`);
            return null;
        }

        if(user === null || !(user.TYPE === 'Admin' || user.TYPE === 'Customer')){
            console.error(`Unauthorized user : permission denied...`);
            return null;
        }

        const plSpl = `
        DECLARE 
        BEGIN 
            SELL_ORDER_SUCCESS(:orderId,:buyerId);
        END;
        `;

        const binds = {
            orderId: orderId,
            buyerId: buyerId
        };

        await execute(plSpl, binds);

        const result = await getOrderDetailsById(orderId);

        

        return result.STATUS;

    }catch (error) {
        console.error(`While placing order details : ${error.message}`);
        return null;
    }
};

const getOrdersBySymbolAndType = async (payload) => {
    try{
        const symbol = payload.symbol;
        const type = payload.type;

        const sql = `
        SELECT 
        ORDER_ID,
        (SELECT NAME FROM "USER" WHERE "USER".USER_ID = "ORDER".USER_ID) NAME,
        STATUS,
        LATEST_QUANTITY,
        LATEST_PRICE,
        TRANSACTION_FEE,
        FORMAT_TIMESTAMP_ORDER(LATEST_UPDATE_TIME) LATEST_UPDATE_TIME,
        FORMAT_TIMESTAMP_ORDER(TRANSACTION_TIME) TRANSACTION_TIME,
        STOP_PRICE
        FROM "ORDER" 
        WHERE SYMBOL = :symbol AND "TYPE" = :type
        ORDER BY LATEST_UPDATE_TIME DESC
        `;

        const bind = {
            symbol: symbol,
            type: type
        };

        const result = await execute(sql,bind);

        return result.rows;

    }catch (error) {
        console.error(`While getting orders by ${payload.symbol}`);
        return null;
    }
}

const cancelOrder = async (payload) => {
    try{
        let order = await getOrderDetailsById(payload.orderId);


        if(order.USER_ID !== payload.userId) {  
            console.error(`Deletion permission denied`);
            return `FAILED`;
        }

        if(order.STATUS !== `PENDING`){
            console.error(`Order completed already`);
            return `FAILED`;
        }

        const sql = `
        DELETE FROM "ORDER" WHERE "ORDER_ID" = :orderId
        `;

        const binds = {
            orderId : payload.orderId
        };


        await execute(sql,binds);

        return `SUCCESS`;

    }catch (error) {
        console.error(`While canceling order : ${error.message}`);
        return `FAILED`;
    }
}

module.exports = {
    getAllOrders,
    getOrderDetailsById,
    getAllOrdersByType,
    placeOrder,
    setBuyOrderStatus,
    sellOrderSuccess,
    getUserOrdersByType,
    getOrdersBySymbolAndType,
    updateOrder,
    cancelOrder
};

