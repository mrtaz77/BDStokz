const {execute} = require('../config/database');
const oracledb = require('oracledb');
const {getAllStockDataBySymbol} = require('./stock');
const userController = require('./user');

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

const updateStock = async (payload) => {
    try{
        const adminId = payload.adminId ;
        const symbol = payload.symbol;
        const field = payload.field;
        const newValue = payload.newValue;
        console.log(payload);

        const admin = await userController.getUserById(adminId);

        if(admin == null || admin.TYPE != 'Admin'){
            console.log("Not an admin");
            return null;
        }

        const stock = await getAllStockDataBySymbol(payload);

        if(stock == null){
            console.log("Stock not found");
            return null;
        }

        // additional check for new stock symbol 
        if(field == `SYMBOL`){
            const stock = await getAllStockDataBySymbol({symbol:newValue});
            if(stock != null){
                console.log("Stock symbol already present");
                return null;
            }
            payload.symbol = symbol;
        }

        const sql = `
        UPDATE STOCK
        SET ${field} = :newVal
        WHERE SYMBOL = :symbol
        `;

        const binds = {
            symbol: symbol,
            newVal: newValue
        };

        await execute(sql, binds);


        const newStock = await getAllStockDataBySymbol(payload);

        return newStock;
    }catch(err){
        console.log(`Found ${err.message} while updating stock info...`);
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

async function getDailyProfit() {
    try {
        const plSql = `
            DECLARE
                v_profits VARCHAR2(32767);
            BEGIN
                DAILY_PROFIT(v_profits);
                :profits := v_profits;
            END;
        `;

        const bindVariables = {
            profits: {
                dir: oracledb.BIND_OUT,
                type: oracledb.STRING,
                maxSize: 32767
            }
        };

        const result = await execute(plSql, bindVariables);
        const jsonString = result.outBinds.profits;

        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error in getDailyProfit:', error);
        throw error;
    }
}

const getAllEmployeeNames = async() =>{
    try{
        const sql = `
        SELECT (FIRST_NAME||' '||LAST_NAME) NAME
        FROM EMPLOYEE  
        `;

        const result = await execute(sql,{});
        return result;

    } catch (error) {
        console.error(`While getting employees`);
        return null;
    }
}

const getAllEmployeeDetailsByFullname = async(name) => {
    try{
        const sql = `
        SELECT * 
        FROM EMPLOYEE NATURAL JOIN EMP_CONTACT
        WHERE FIRST_NAME || ' ' || LAST_NAME  = :name   
        `;

        const bind = {
            name: name
        }

        const result = await execute(sql,bind);
        return result;

    } catch (error) {
        console.error(`While getting details for ${name}`);
        return null;
    }
}

const getAllUserNameAndType = async () => {
    try{
        const sql = `
        SELECT 
            NAME,
            "TYPE"
        FROM 
            "USER"
        `;

        return await execute(sql,{});


    }catch (error) {
        console.error(`While getting users`);
        return null;
    }
}



module.exports = {
    getAllCustomerInfo,
    updateStock,
    block,
    getDailyProfit,
    getAllEmployeeNames,
    getAllEmployeeDetailsByFullname,
    getAllUserNameAndType
}