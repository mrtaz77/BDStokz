const oracledb = require('oracledb');
const db = require('../config/database.js');

const getData = async (payload) => {
    console.log(payload);
    const sql = `
    SELECT SYMBOL,LTP 
    FROM STOCK
    WHERE LTP > 980
    ORDER BY LTP DESC
    `;

    const binds = {}

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            console.log(`No stocks found`);
            return null;
        }
        return result.rows.slice(0,5);
    }catch(err){
        console.error(`Found error: ${err} while searching for stocks...`);
    }
}

module.exports = getData