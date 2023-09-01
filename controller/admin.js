const {execute} = require('../config/database');
const oracledb = require('oracledb');
const {getAllStockDataBySymbol} = require('./stock');
const userController = require('./user');
const {chkCreds} = require('./login');
const orderController = require('./order');

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
        return result.rows;

    } catch (error) {
        console.error(`While getting employees`);
        return null;
    }
}

const getAllEmployeeDetailsByFullname = async(name) => {
    try{
        const sql = `
        SELECT 
            EMPLOYEE.EMPLOYEE_ID,
            EMPLOYEE.FIRST_NAME,
            EMPLOYEE.LAST_NAME,
            EMPLOYEE.EMAIL,
            EMPLOYEE.SEX,
            EMPLOYEE.NID,
            EMPLOYEE.DESIGNATION,
            EMPLOYEE.ADDRESS,
            EMPLOYEE.ZIP_CODE,
            EMPLOYEE.SALARY,
            EMPLOYEE.HIRE_DATE,
            EMPLOYEE.DOB,
            EMPLOYEE.MANAGER_ID,
            EMP_CONTACT.CONTACT AS CONTACT
        FROM EMPLOYEE LEFT OUTER JOIN EMP_CONTACT ON EMPLOYEE.EMPLOYEE_ID = EMP_CONTACT.EMPLOYEE_ID
        WHERE FIRST_NAME || ' ' || LAST_NAME  = :name   
        `;

        const bind = {
            name: name
        }

        const result = await execute(sql,bind);
        return result.rows;

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
        ORDER BY
            USER_ID
        `;

        const result = await execute(sql,{});
        return result.rows;

    }catch (error) {
        console.error(`While getting users`);
        return null;
    }
}

const addAdmin = async (payload) => {
    try{
        const adderId = payload.adminId;
        const empName = payload.empName;

        const empDetails = await getAllEmployeeDetailsByFullname(empName);
        if(empDetails == null){
            console.log(`Could not find employee details for ${empName}`);
            return null;
        }

        const adder = await userController.getUserById(adderId);

        if(adder == null || adder.TYPE != 'Admin'){
            console.error(`Adder not an admin`);
            return null;
        }

        const existingAdmin = await userController.getUserByName({name:empName});

        if(existingAdmin != null && existingAdmin.TYPE == 'Admin'){
            console.error('Already an admin');
            return null;
        }
        
        const pwd = await userController.getPwdHash('bdStockz@dummy');

        const insertPlsql = `
        BEGIN 
        INSERT INTO "USER" (NAME,PWD,EMAIL,"TYPE",STREET_NO,STREET_NAME,CITY,COUNTRY,ZIP)
        values (:name,:pwd,:email,'Admin',20,'Mirpur','Dhaka','Bangladesh',:zip);

        INSERT INTO ADMIN values(
            (SELECT USER_ID FROM "USER" WHERE NAME = :name),
            :adderId,
            (SELECT EMPLOYEE_ID FROM EMPLOYEE WHERE FIRST_NAME ||' '||LAST_NAME = :name),
            1000
        );
        FOR R IN (
            SELECT CONTACT
            FROM EMP_CONTACT WHERE
            EMPLOYEE_ID = (SELECT EMPLOYEE_ID FROM EMPLOYEE WHERE FIRST_NAME ||' '||LAST_NAME = :name)
        )
        LOOP 
            INSERT INTO USER_CONTACT(USER_ID,CONTACT) values(
            (SELECT USER_ID FROM "USER" WHERE NAME = :name),
            R.CONTACT
            );
        END LOOP;
        END;
        `;
        // console.log(empDetails);

        const binds = {
            name: empName,
            pwd: pwd,
            email : empDetails[0].EMAIL,
            zip : empDetails[0].ZIP_CODE === null ?1200 : empDetails[0].ZIP_CODE,
            adderId : adderId
        };

        // console.log(binds);

        await execute(insertPlsql,binds);

        const newAdmin = await userController.getUserByName({name:empName});

        return newAdmin;

    }catch (error) {
        console.error(`While adding admin got ${error.message}`);
        return null;
    }
};

const deleteUser = async (payload) => {
    try{
        let userId = await userController.getUserByName(payload);
        userId = userId.USER_ID;
        const adminId = payload.deleterId;
        const pwd = payload.pwd;

        console.log(userId);


        const user = await userController.getUserById(userId);

        if(user === null){
            console.error('User not found');
            return 0;
        }

        const admin = await userController.getUserById(adminId);

        if(admin === null || admin.TYPE != 'Admin'){
            console.error(`Deleter not an admin`);
            return 0;
        }

        const pass = await chkCreds(admin.NAME,pwd);

        if(pass !== 1337){
            console.error(`Incorrect password`);
            return 0;
        }

        const sql = `
        DELETE FROM "USER"
        WHERE USER_ID = :userId
        `;

        const binds = {
            userId: userId
        }

        await execute(sql,binds);

        return await userController.getUserById(userId);

    }catch (error) {
        console.error(`While deleting admin got ${error.message}`);
        return 0;
    }
}

const deleteOrderPermanent = async (payload) => {
    try{
        const adminId = payload.adminId;
        const orderId = payload.orderId;

        const admin = await userController.getUserById(adminId);

        if(admin === null || admin.TYPE !== 'Admin'){
            console.error(`Deletion permission denied`);
            return 0;
        }

        const status = 'PENDING';

        const sql = `
        DELETE FROM "ORDER"
        WHERE ORDER_ID = :orderId
        AND STATUS = :status
        `;

        const binds = {
            orderId: orderId,
            status: status
        };
    
        await execute(sql, binds);

        return null;
        
    }catch (error) {
        console.error(`While deleting order ${orderId}`);
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
    getAllUserNameAndType,
    addAdmin,
    deleteUser,
    deleteOrderPermanent
}