const db = require('../config/database.js');
const oracledb = require('oracledb');

let errors = [];

async function getStockErrors(){
    return errors;
}


const getAllStockSymbol = async (payload) => {
    errors.length = 0;
    const sql = `
    SELECT
        SYMBOL 
    FROM
        STOCK 
    WHERE 
        BLOCKED = 'F'
    ORDER BY
        SYMBOL
    `;

    const binds = {};

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            errors.push(`No stocks found`);
            return null;
        }
        return result.rows;
    }catch(err){
        errors.push(`Found error: ${err} while searching for stocks...`);
        null;
    }
}

const getAllStockDataBySymbol = async (payload) => {
    errors.length = 0;
    const symbol = payload.symbol;
    const sql = `
    SELECT
        S.SYMBOL,
        U.NAME CORP_NAME,
        C.SECTOR,
        S.UPDATE_TIME,
        S.VALUE,
        S.PRICE,
        S.LTP,
        S.AVAILABLE_LOTS,
        S.LOT,
        S.BLOCKED,
        OPEN(S.SYMBOL) OPEN,
        CLOSE(S.SYMBOL)  CLOSE,
        HIGH(S.SYMBOL)  HIGH,
        LOW(S.SYMBOL) LOW,
        ROUND(AVG(NVL(S.LTP - O.LATEST_PRICE, 0)), 4) AS CHANGE,
        ROUND(AVG(NVL((S.LTP - O.LATEST_PRICE) / NVL(O.LATEST_PRICE, S.LTP) * 100, 0)), 4) AS "CHANGE%",
        ROUND(AVG(NVL(
            (
            SELECT SUM(O4.LATEST_QUANTITY) 
            FROM "ORDER" O4 
            WHERE O4.SYMBOL = S.SYMBOL 
            AND O4.STATUS = 'SUCCESS' 
            AND TRUNC(O4.TRANSACTION_TIME) = TRUNC(O.TRANSACTION_TIME)
            ), 0)), 4) AS VOLUME 
    FROM
        STOCK S
    LEFT JOIN CORPORATION C ON S.CORP_ID = C.CORP_ID
    LEFT JOIN (
        SELECT
            O1.SYMBOL,
            O1.LATEST_PRICE,
            O1.TRANSACTION_TIME
        FROM
            "ORDER" O1
        WHERE
            O1.STATUS = 'SUCCESS'
            AND TRUNC(O1.TRANSACTION_TIME) >= ALL (
                SELECT TRUNC(O2.TRANSACTION_TIME)
                FROM "ORDER" O2
                WHERE O2.SYMBOL = O1.SYMBOL AND O2.STATUS = 'SUCCESS'
            )
            AND TO_TIMESTAMP(TO_CHAR(TRANSACTION_TIME, 'HH24-MI-SS'), 'HH24-MI-SS') <= ALL (
                SELECT
                    TO_TIMESTAMP(TO_CHAR(O3.TRANSACTION_TIME, 'HH24-MI-SS'), 'HH24-MI-SS')
                FROM
                    "ORDER" O3
                WHERE
                    O3.SYMBOL = O1.SYMBOL
                    AND O3.STATUS = 'SUCCESS'
                    AND TRUNC(O3.TRANSACTION_TIME) = TRUNC(O1.TRANSACTION_TIME)
            )
    ) O ON S.SYMBOL = O.SYMBOL
    LEFT JOIN "USER" U ON S.CORP_ID = U.USER_ID
    WHERE
        S.SYMBOL = :symbol
        AND S.BLOCKED = 'F'
    GROUP BY 
        S.SYMBOL,
        U.NAME,
        C.SECTOR,
        S.UPDATE_TIME,
        S.VALUE,
        S.PRICE,
        S.LTP,
        S.AVAILABLE_LOTS,
        S.LOT,
        S.BLOCKED,
        OPEN(S.SYMBOL),
        CLOSE(S.SYMBOL),
        HIGH(S.SYMBOL),
        LOW(S.SYMBOL) 
    `;

    const binds = {
        symbol: symbol
    }
    
    try {
        const result = (await db.execute(sql,binds)).rows;
        if(result == null){
            errors.push(`Stock ${symbol} not found...`);
            return null;
        }
        return result[0];
    }catch(err) {
        errors.push(err);
        return null;
    }
}

const getTopLoserGainer = async(payload) => {
    // console.log(payload.order);
    errors.length = 0;
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
        S.SYMBOL,
        ( SELECT NAME FROM "USER" WHERE S.CORP_ID = USER_ID ) CORPORATION,
        S.LTP,
        ROUND(AVG(S.LTP - NVL( C.LATEST_PRICE, S.LTP )),4) CHANGE,
        ROUND(AVG(
            ( S.LTP - NVL( C.LATEST_PRICE, S.LTP ) ) / NVL( C.LATEST_PRICE, S.LTP ) * 100),4) "CHANGE%",
        ROUND(AVG(NVL(
            (
            SELECT
                SUM( O4.LATEST_QUANTITY ) 
            FROM
                "ORDER" O4 
            WHERE
                O4.SYMBOL = S.SYMBOL 
                AND O4.STATUS = 'SUCCESS' 
                AND TRUNC( O4.TRANSACTION_TIME ) = TRUNC( C.TRANSACTION_TIME ) 
            ),
            0 
        )),4) VOLUME 
    FROM
        STOCK S LEFT OUTER
        JOIN (
        SELECT
            O1.SYMBOL,
            O1.LATEST_PRICE,
            O1.TRANSACTION_TIME 
        FROM
            "ORDER" O1 
        WHERE
            O1.STATUS = 'SUCCESS' 
            AND TRUNC( O1.TRANSACTION_TIME ) >= ALL ( SELECT TRUNC( O2.TRANSACTION_TIME ) FROM "ORDER" O2 WHERE O2.SYMBOL = O1.SYMBOL AND O2.STATUS = 'SUCCESS' ) 
            AND TO_TIMESTAMP( TO_CHAR( TRANSACTION_TIME, 'HH24-MI-SS' ), 'HH24-MI-SS' ) <= ALL (
            SELECT
                TO_TIMESTAMP( TO_CHAR( O3.TRANSACTION_TIME, 'HH24-MI-SS' ), 'HH24-MI-SS' ) 
            FROM
                "ORDER" O3 
            WHERE
                O3.SYMBOL = O1.SYMBOL 
                AND O3.STATUS = 'SUCCESS' 
                AND TRUNC( O3.TRANSACTION_TIME ) = TRUNC( O1.TRANSACTION_TIME ) 
            ) 
        ) C ON S.SYMBOL = C.SYMBOL 
        WHERE S.BLOCKED = 'F' AND S.LTP > 0
		GROUP BY 
			S.SYMBOL, S.LTP , S.CORP_ID
    ORDER BY
        "CHANGE%" ${sort},
        S.LTP ${sort} FETCH FIRST 5 ROWS ONLY
    `;
    
    
    try {
        const result = (await db.execute(sql,{})).rows;
        if(result.length === 0){
            errors.push(`Top ${payload.order}ers not found...`);
            return null;
        }
        return result;
    }catch(err) {
        errors.push(err);
        return null;
    }
}

const getAnnualAvgPrice = async () => {
    errors.length = 0;
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
        // console.log('Received JSON string:', jsonString);
    
        let jsonObject;
        try {
            jsonObject = JSON.parse(jsonString);
            // console.log('Parsed JSON object:', jsonObject);
        } catch (parseError) {
            errors.push('Error parsing JSON:', parseError);
            return null;
        }
        return jsonObject;
    }catch(err){
        errors.push(`Found ${err.message} while getting dsex`);
        return null;
    }
}

const getBlockedStatusBySymbol = async (symbol) => {
    try{
        const sql = `
        SELECT BLOCKED 
        FROM STOCK WHERE SYMBOL = :symbol
        `;

        const bind = {
            symbol: symbol
        };

        const result = await db.execute(sql, bind);

        return result.rows[0].BLOCKED;

    }catch(error){
        errors.push(`Found ${error.message} while getting dsex`);
        return null;
    }
}

module.exports = {
    getAllStockSymbol,
    getAllStockDataBySymbol,
    getTopLoserGainer,
    getAnnualAvgPrice,
    getStockErrors,
    getBlockedStatusBySymbol
};