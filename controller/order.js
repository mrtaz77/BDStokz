const {execute} = require('../config/database');
const oracledb = require('oracledb');
const userController = require('./user');

let errors = [];

async function getOrderErrors(){
    return errors;
}

const getAllOrders = async () => {
    errors.length = 0;
    try{
        const sql = `
        SELECT 
        ORDER_ID,
        SYMBOL,
        (SELECT NAME FROM "USER" WHERE "USER".USER_ID = "ORDER".USER_ID AND IS_DELETED = 'F') NAME,
        "TYPE",
        STATUS,
        ROUND(LATEST_QUANTITY/(SELECT LOT FROM STOCK WHERE SYMBOL = "ORDER".SYMBOL),4) LATEST_QUANTITY,
        LATEST_PRICE,
        TRANSACTION_FEE,
        FORMAT_TIMESTAMP_ORDER(LATEST_UPDATE_TIME) LATEST_UPDATE_TIME,
        FORMAT_TIMESTAMP_ORDER(TRANSACTION_TIME) TRANSACTION_TIME,
        STOP_PRICE
        FROM "ORDER" 
        ORDER BY ORDER_ID DESC
        `;

        const bind = {
        };

        const result = await execute(sql,bind);

        return result.rows;

    }catch (error) {
        errors.push(`While getting orders`);
        return null;
    }
}

const getUserOrdersByType = async (payload) => {
    errors.length = 0;
    try{
        const userId = payload.userId;
        const type = payload.type;

        const sql = `
        SELECT 
            ORDER_ID,
            SYMBOL,
            STATUS,
            ROUND(LATEST_QUANTITY/(SELECT LOT FROM STOCK WHERE SYMBOL = "ORDER".SYMBOL),4) LATEST_QUANTITY,
            LATEST_PRICE,
            TRANSACTION_FEE,
            FORMAT_TIMESTAMP_ORDER(LATEST_UPDATE_TIME) LATEST_UPDATE_TIME,
            FORMAT_TIMESTAMP_ORDER(TRANSACTION_TIME) TRANSACTION_TIME,
            STOP_PRICE
            FROM "ORDER"  
            WHERE USER_ID = :userId AND "TYPE" = :type
            ORDER BY ORDER_ID DESC
        `;

        const binds = {
            userId: userId,
            type: type
        };

        const result = await execute(sql, binds);

        return result.rows;

    }catch (error) {
        errors.push(`While getting orders`);
        return null;
    }
}

const getAllOrdersByType = async (payload) => {
    try{
        errors.length = 0;
        // const n = payload.n || 30;
        const type = payload.type || 'SELL';

        const sql = `
        SELECT 
            ORDER_ID,
            SYMBOL,
            USER_ID,
            STATUS,
            ROUND(LATEST_QUANTITY/(SELECT LOT FROM STOCK WHERE SYMBOL = "ORDER".SYMBOL),4) LATEST_QUANTITY,
            LATEST_PRICE,
            TRANSACTION_FEE,
            FORMAT_TIMESTAMP_ORDER(LATEST_UPDATE_TIME),
            FORMAT_TIMESTAMP_ORDER(TRANSACTION_TIME),
            STOP_PRICE
            FROM "ORDER" 
            WHERE "TYPE" = :type
            ORDER BY ORDER_ID DESC
            --FETCH FIRST :n ROWS ONLY
        `;

        const bind = {
            type : type
        };

        const result = await execute(sql,bind);

        return result.rows;

    }catch (error) {
        errors.push(`While getting orders`);
        return null;
    }
}

const getOrderDetailsById = async (orderId) => {
    try{
        errors.length = 0;
        const sql = `
        SELECT 
            ORDER_ID,
            SYMBOL,
            USER_ID,
            "TYPE",
            STATUS,
            ROUND(LATEST_QUANTITY/(SELECT LOT FROM STOCK WHERE SYMBOL = "ORDER".SYMBOL),4) LATEST_QUANTITY,
            LATEST_PRICE,
            TRANSACTION_FEE,
            FORMAT_TIMESTAMP_ORDER(LATEST_UPDATE_TIME) LATEST_UPDATE_TIME,
            FORMAT_TIMESTAMP_ORDER(TRANSACTION_TIME) TRANSACTION_TIME,
            STOP_PRICE
            FROM "ORDER"  
            WHERE ORDER_ID = :orderId
            ORDER BY ORDER_ID DESC
        `;

        const binds = {
            orderId: orderId
        };

        const result = await execute(sql,binds);

        return result.rows[0];

    }catch (error) {
        errors.push(`While getting order details of ${orderId}`);
        return null;
    }
}

const placeOrder = async (payload) => {
    try{
        errors.length = 0;
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
            errors.push(`Invalid type ${type}`);
            return null;
        }

        const result = await execute(sql, binds);

        // Now, result.outBinds.orderId contains the generated ORDER_ID
        const id = result.outBinds.orderId[0];

        // console.log(id);

        const order = await getOrderDetailsById(id);

        return order;

    }catch (error) {
        errors.push(`While placing order details : ${error.message}`);
        return null;
    }
}

const updateOrder = async (payload) => {
    try{
        errors.length = 0;

        let order = await getOrderDetailsById(payload.orderId);

        const userId = order.USER_ID;

        if (userId !== payload.userId) {
            errors.push(`Update Permission denied`);
            return null;
        }

        const sql = `
        UPDATE "ORDER"
        SET LATEST_PRICE = :price,LATEST_QUANTITY = :quantity 
        WHERE "ORDER_ID" = :order_id
        `;



        const binds = {
            price : payload.price,
            quantity : payload.quantity,
            order_id: payload.orderId
        }

        await execute(sql,binds);

        order = await getOrderDetailsById(payload.orderId);

        return order;

    }catch (error) {
        errors.push(`While updating order details : ${error.message}`);
        return null;
    }
}


const setBuyOrderStatus = async (payload) => {
    try{
        errors.length = 0;
        const corpId = payload.corpId;
        const orderId = payload.orderId;
        const status = payload.status;

        const corp = await userController.getUserById(corpId);

        if(corp.TYPE !== `Corp`){
            errors.push(`Unauthorized user : permission denied...`);
            return null;
        }

        const order = await getOrderDetailsById(orderId);

        if(order === null || order.STATUS !== 'PENDING' || order.TYPE !== 'BUY'){
            // console.log('order.TYPE: ', order.TYPE);
            // console.log('order.STATUS: ', order.STATUS);
            // console.log('order: ', order);
            errors.push(`Invalid order request`);
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
        errors.push(`While setting order status : ${error.message}`);
        return null;
    }
}

const sellOrderSuccess = async (payload) => {
    try{
        errors.length = 0;
        const orderId = payload.orderId;
        const buyerId = payload.buyerId;
        const order = await getOrderDetailsById(orderId);
        const user = await userController.getUserById(buyerId);

        if(order === null || order.STATUS !== 'PENDING' || order.TYPE !== 'SELL'){
            // console.log('order.TYPE: ', order.TYPE);
            // console.log('order.STATUS: ', order.STATUS);
            // console.log('order: ', order);
            errors.push(`Invalid order request`);
            return null;
        }

        if(user === null || !(user.TYPE === 'Admin' || user.TYPE === 'Customer')){
            errors.push(`Unauthorized user : permission denied...`);
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
        errors.push(`While placing order details : ${error.message}`);
        return null;
    }
};

const getOrdersBySymbolAndType = async (payload) => {
    try{
        errors.length = 0;
        const symbol = payload.symbol;
        const type = payload.type;

        const sql = `
        SELECT 
        ORDER_ID,
        (SELECT NAME FROM "USER" WHERE "USER".USER_ID = "ORDER".USER_ID AND IS_DELETED = 'F') NAME,
        STATUS,
        ROUND(LATEST_QUANTITY/(SELECT LOT FROM STOCK WHERE SYMBOL = "ORDER".SYMBOL),4) LATEST_QUANTITY,
        LATEST_PRICE,
        TRANSACTION_FEE,
        FORMAT_TIMESTAMP_ORDER(LATEST_UPDATE_TIME) LATEST_UPDATE_TIME,
        FORMAT_TIMESTAMP_ORDER(TRANSACTION_TIME) TRANSACTION_TIME,
        STOP_PRICE
        FROM "ORDER" 
        WHERE SYMBOL = :symbol AND "TYPE" = :type
        ORDER BY ORDER_ID DESC
        `;

        const bind = {
            symbol: symbol,
            type: type
        };

        const result = await execute(sql,bind);

        return result.rows;

    }catch (error) {
        errors.push(`While getting orders by ${payload.symbol}`);
        return null;
    }
}

const cancelOrder = async (payload) => {
    try{
        errors.length = 0;
        let order = await getOrderDetailsById(payload.orderId);


        if(order.USER_ID !== payload.userId) {  
            errors.push(`Deletion permission denied`);
            return `FAILED`;
        }

        if(order.STATUS !== `PENDING`){
            errors.push(`Order completed already`);
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
        errors.push(`While canceling order : ${error.message}`);
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
    cancelOrder,
    getOrderErrors
};

