const {execute} = require('../config/database');
const oracledb = require('oracledb');

const getAllOrders = async () => {
    try{
        const sql = `
        SELECT * 
        FROM "ORDER" 
        ORDER BY LATEST_UPDATE_TIME DESC
        `;

        const result = await execute(sql,{});

        return result.rows;

    }catch (error) {
        console.error(`While getting orders`);
        return null;
    }
}

const getOrderDetailsById = async (orderId) => {
    try{
        const sql = `
        SELECT * 
        FROM "ORDER" 
        WHERE ORDER_ID = :orderId
        `;

        const binds = {
            orderId: orderId
        };

        const result = await execute(sql,binds);

        return result.rows;

    }catch (error) {
        console.error(`While getting order details of ${orderId}`);
        return null;
    }
}



module.exports = {
    getAllOrders,
    getOrderDetailsById
};