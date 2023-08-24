const db = require('../config/database.js');

const getAllStockSymbol = async (payload) => {
    console.log(payload);
    const sql = `
    SELECT
        SYMBOL 
    FROM
        STOCK 
    ORDER BY
        SYMBOL
    `;

    const binds = {}

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            console.log(`No stocks found`);
            return null;
        }
        return result.rows;
    }catch(err){
        console.error(`Found error: ${err} while searching for stocks...`);
    }
}

const getAllStockDataBySymbol = async (payload) => {
    const symbol = payload.symbol;
    const sql = `
        SELECT *
        FROM STOCK 
        WHERE SYMBOL = :symbol
    `;

    const binds = {
        symbol: symbol
    }
    
    try {
        const result = (await db.execute(sql,binds)).rows;
        if(result.length === 0){
            console.log(`Stock ${symbol} not found...`);
            return null;
        }
        return result[0];
    }catch(err) {
        console.log(err);
    }
}

module.exports = {getAllStockSymbol,getAllStockDataBySymbol};