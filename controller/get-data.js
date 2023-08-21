const oracledb = require('oracledb');
const db = require('../config/database.js');

const getData = async (payload) => {
    console.log(payload);
    const sql = `
    SELECT SYMBOL,LTP 
    FROM STOCK
    ORDER BY LTP
    `;

    const binds = {}

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            console.log(`No stocks found`);
            return null;
        }
        // const jsonData = result.rows.map(row => {
        //     const [company, stockPrice] = row;
        //     return { company, stockPrice };
        // });
        return result.rows;
    }catch(err){
        console.error(`Found error: ${err} while searching for stocks...`);
    }
}

module.exports = getData