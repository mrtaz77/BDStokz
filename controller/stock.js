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

module.exports = {getAllStockSymbol};