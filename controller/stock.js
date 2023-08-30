const db = require('../config/database.js');
const oracledb = require('oracledb');

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
    SELECT
        SYMBOL,
        (SELECT NAME FROM "USER" WHERE USER_ID = STOCK.CORP_ID) CORP_NAME,
        SECTOR,
        UPDATE_TIME,
        VALUE,
        PRICE,
        LTP,
        AVAILABLE_LOTS,
        LOT,
        BLOCKED,
        OPEN(SYMBOL) OPEN,
        CLOSE(SYMBOL) CLOSE,
        HIGH(SYMBOL) HIGH,
        LOW(SYMBOL) LOW
    FROM
        STOCK LEFT OUTER
        JOIN CORPORATION ON STOCK.CORP_ID = CORPORATION.CORP_ID 
    WHERE
        SYMBOL = :symbol
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

const getTopLoserGainer = async(payload) => {
    console.log(payload.order);
    let sort;
    switch(payload.order){
        case `gain` :
            sort = `DESC`
            break;
        case `lose` :
            sort = `ASC`
            break;
        default :
            return null;
    }
    const sql = `
        SELECT
            O1.SYMBOL,
            ( SELECT NAME FROM "USER" WHERE S.CORP_ID = USER_ID ) CORPORATION,
            O1.LATEST_PRICE,
            S.LTP,
            S.LTP - O1.LATEST_PRICE CHANGE,
            ROUND( ( S.LTP - O1.LATEST_PRICE ) / O1.LATEST_PRICE * 100, 4 ) "CHANGE%",
            (
            SELECT
                SUM( O4.LATEST_QUANTITY ) 
            FROM
                "ORDER" O4 
            WHERE
                O4.SYMBOL = O1.SYMBOL 
                AND TRUNC( O4.TRANSACTION_TIME ) = TRUNC( O1.TRANSACTION_TIME ) 
            ) VOLUME 
        FROM
            "ORDER" O1
            JOIN STOCK S ON O1.SYMBOL = S.SYMBOL 
        WHERE
            TRUNC( O1.TRANSACTION_TIME ) >= ALL ( SELECT TRUNC( O2.TRANSACTION_TIME ) FROM "ORDER" O2 WHERE O2.SYMBOL = O1.SYMBOL ) 
            AND TO_TIMESTAMP( TO_CHAR( TRANSACTION_TIME, 'HH24-MI-SS' ), 'HH24-MI-SS' ) <= ALL (
            SELECT
                TO_TIMESTAMP( TO_CHAR( O3.TRANSACTION_TIME, 'HH24-MI-SS' ), 'HH24-MI-SS' ) 
            FROM
                "ORDER" O3 
            WHERE
                O3.SYMBOL = O1.SYMBOL 
                AND TRUNC( O3.TRANSACTION_TIME ) = TRUNC( O1.TRANSACTION_TIME ) 
            ) 
        ORDER BY
            "CHANGE%" ${sort} FETCH FIRST 5 ROWS ONLY
    `;
    
    
    try {
        const result = (await db.execute(sql,{})).rows;
        if(result.length === 0){
            console.log(`Top ${payload.order}ers not found...`);
            return null;
        }
        return result;
    }catch(err) {
        console.log(err);
    }
}

const getAnnualAvgPrice = async (payload) => {
    const plsqlBlock = `
    DECLARE
        ANS VARCHAR2(32767);
    BEGIN 
        AVG_PRICE_ACROSS_YEAR(ANS);
        :result := ANS;
    END;
    `;

    const bindVars = {
        result: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR2, maxSize: 32767 }
    };

    try{
        const result = await db.execute(plsqlBlock, bindVars);
        const jsonString = result.outBinds.result;
        console.log('Received JSON string:', jsonString);
    
        let jsonObject;
        try {
            jsonObject = JSON.parse(jsonString);
            console.log('Parsed JSON object:', jsonObject);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
        }
        return jsonObject;
    }catch(err){
        console.log(`Found ${err.message} while getting dsex`);
        return null;
    }
}


module.exports = {
    getAllStockSymbol,
    getAllStockDataBySymbol,
    getTopLoserGainer,
    getAnnualAvgPrice
};