const {execute} = require('../config/database');
const oracledb = require('oracledb');
const {getAllStockDataBySymbol} = require('./stock');

const getAllCustomerInfo = async (payload) => {
    try{
        const sql = `
        SELECT
            "USER".USER_ID,
            NAME,
            EMAIL,
            ( STREET_NO || ' ' || STREET_NAME || ', ' || CITY || ', ' || COUNTRY ) ADDRESS,
            ZIP,
            REG_DATE,
            REFERER_ID,
            REFER_COUNT,
            BROKER_ID,
            CONTACT	
        FROM
            "USER"
            JOIN CUSTOMER ON "USER".USER_ID = CUSTOMER.USER_ID 
            LEFT OUTER JOIN USER_CONTACT ON "USER".USER_ID = USER_CONTACT.USER_ID
        `;
        
        const result = await execute(sql,{});
        if(result.rows.length==0){
            console.log(`No customer data found...`);
            return null;
        }
        return result.rows;

    }catch(err){
        console.log(`Found ${err.message} while getting customer info...`);
        return null;
    }
} 

const block = async (set,payload) => {
    const symbol = payload.symbol;
    try{
        const result = await getAllStockDataBySymbol(payload);
        if(result == null){
            console.log(`No stock data found`);
            return null;
        }else if(result.BLOCKED == set){
            console.log(`${symbol} already ${set}`);
            return result;
        }

        const sql = `
        UPDATE STOCK 
        SET BLOCKED = :status
        WHERE SYMBOL = :symbol
        `;

        const binds = {
            status: set,
            symbol: symbol
        }

        await execute(sql, binds);

        return await getAllStockDataBySymbol(payload);
    }catch(err){
        console.log(`Found ${err.message} while setting ${symbol} to ${set}...`);
        throw err;
    }
}


module.exports = {
    getAllCustomerInfo,
    block
}