const {execute} = require('../config/database');
const oracledb = require('oracledb');
const {
    getAllStockDataBySymbol,
    getBlockedStatusBySymbol
} = require('./stock');
const userController = require('./user');
const {chkCreds} = require('./login');

let errors = [];

async function getAdminErrors(){
    return errors;
}

const getAllCustomerInfo = async () => {
    try{
        errors.length = 0;
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
        WHERE 
            IS_DELETED = 'F'
        `;
        
        const result = await execute(sql,{});
        if(result.rows.length==0){
            errors.push(`No customer data found...`);
            return null;
        }
        return result.rows;

    }catch(err){
        errors.push(`Found ${err.message} while getting customer info...`);
        return null;
    }
} 

const updateStock = async (payload) => {
    try{
        errors.length = 0;
        const adminId = payload.adminId ;
        const symbol = payload.symbol;
        const field = payload.field;
        const newValue = payload.newValue;
        console.log(payload);

        const admin = await userController.getUserById(adminId);

        if(admin == null || admin.TYPE != 'Admin'){
            errors.push("Not an admin");
            return null;
        }

        const stock = await getAllStockDataBySymbol(payload);

        if(stock == null){
            errors.push("Stock not found");
            return null;
        }

        // additional check for new stock symbol 
        if(field == `SYMBOL`){
            const stock = await getAllStockDataBySymbol({symbol:newValue});
            if(stock != null){
                errors.push("Stock symbol already present");
                return null;
            }
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


        const newStock = await getAllStockDataBySymbol({symbol:newValue});

        return newStock;
    }catch(err){
        errors.push(`Found ${err.message} while updating stock info...`);
        return null;
    }
}

const block = async (set,payload) => {
    try{
        errors.length = 0;
        const symbol = payload.symbol;
        const result = await getBlockedStatusBySymbol(payload.symbol);
        if(result == null){
            errors.push(`No stock data found`);
            return null;
        }else if(result === set){
            errors.push(`${symbol} already ${set}`);
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

        return await getBlockedStatusBySymbol(payload.symbol);
    }catch(err){
        errors.push(`Found ${err.message} while setting ${payload.symbol} to ${set}...`);
        return await getBlockedStatusBySymbol(payload.symbol);
    }
}

async function getDailyProfit() {
    try {
        errors.length = 0;
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
        errors.push('Error in getDailyProfit: ', error);
        throw error;
    }
}

const getAllEmployeeNames = async() =>{
    try{
        errors.length = 0;
        const sql = `
        SELECT (FIRST_NAME||' '||LAST_NAME) NAME
        FROM EMPLOYEE  
        WHERE IS_DELETED = 'F'
        `;

        const result = await execute(sql,{});
        return result.rows;

    } catch (error) {
        errors.push(`While getting employees`);
        return null;
    }
}

const getAllEmployeeDetailsByFullname = async(name) => {
    try{
        errors.length = 0;
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
        WHERE FIRST_NAME || ' ' || LAST_NAME  = :name  AND IS_DELETED = 'F' 
        `;

        const bind = {
            name: name
        }

        const result = await execute(sql,bind);
        return result.rows;

    } catch (error) {
        errors.push(`While getting details for ${name}`);
        return null;
    }
}

const getAllUserNameAndType = async () => {
    try{
        errors.length = 0;
        const sql = `
        SELECT 
            NAME,
            "TYPE"
        FROM 
            "USER"
        WHERE IS_DELETED = 'F'
        ORDER BY
            USER_ID
        `;

        const result = await execute(sql,{});
        return result.rows;

    }catch (error) {
        errors.push(`While getting users`);
        return null;
    }
}

const addAdmin = async (payload) => {
    try{
        errors.length = 0;
        const adderId = payload.adminId;
        const empName = payload.empName;

        const empDetails = await getAllEmployeeDetailsByFullname(empName);
        if(empDetails == null){
            errors.push(`Could not find employee details for ${empName}`);
            return null;
        }

        const adder = await userController.getUserById(adderId);

        if(adder == null || adder.TYPE != 'Admin'){
            errors.push(`Adder not an admin`);
            return null;
        }

        const existingAdmin = await userController.getUserByName({name:empName});

        if(existingAdmin != null && existingAdmin.TYPE == 'Admin'){
            errors.push('Already an admin');
            return null;
        }
        
        const password = await userController.getPwdHash('bdStockz@dummy');

        const insertPlsql = `
        BEGIN 
        INSERT INTO "USER" (NAME,PWD,EMAIL,"TYPE",STREET_NO,STREET_NAME,CITY,COUNTRY,ZIP)
        values (:name,:password,:email,'Admin',20,'Mirpur','Dhaka','Bangladesh',:zip);

        INSERT INTO ADMIN(ADMIN_ID,ADDER_ID,EMPLOYEE_ID) values(
            (SELECT USER_ID FROM "USER" WHERE NAME = :name),
            :adderId,
            (SELECT EMPLOYEE_ID FROM EMPLOYEE WHERE FIRST_NAME ||' '||LAST_NAME = :name),
            25000
        );
        FOR R IN (
            SELECT CONTACT
            FROM EMP_CONTACT WHERE
            EMPLOYEE_ID = (SELECT EMPLOYEE_ID FROM EMPLOYEE WHERE FIRST_NAME ||' '||LAST_NAME = :name AND IS_DELETED = 'F')
        )
        LOOP 
            INSERT INTO USER_CONTACT(USER_ID,CONTACT) values(
            (SELECT USER_ID FROM "USER" WHERE NAME = :name AND IS_DELETED = 'F'),
            R.CONTACT
            );
        END LOOP;
        END;
        `;
        // console.log(empDetails);

        const binds = {
            name: empName,
            password: password,
            email : empDetails[0].EMAIL,
            zip : empDetails[0].ZIP_CODE === null ? 1200 : empDetails[0].ZIP_CODE,
            adderId : adderId
        };

        // console.log(binds);

        await execute(insertPlsql,binds);

        const newAdmin = await userController.getUserByName({name:empName});

        return newAdmin;

    }catch (error) {
        errors.push(`While adding admin got ${error.message}`);
        return null;
    }
};

const deleteUser = async (payload) => {
    try{
        errors.length = 0;
        const userId = payload.userId;
        const adminId = payload.deleterId;
        const password = payload.password;


        const user = await userController.getUserById(userId);

        if(user === null){
            errors.push('User not found');
            return 0;
        }

        if(user.TYPE === 'Admin'){
            errors.push('Cannot delete admin');
            return 0;	
        }

        const admin = await userController.getUserById(adminId);

        if(admin === null || admin.TYPE != 'Admin'){
            errors.push(`Deleter not an admin`);
            return 0;
        }

        const pass = await chkCreds(admin.NAME,password);

        if(pass !== 1337){
            errors.push(`Incorrect password`);
            return 0;
        }

        const sql = `
        UPDATE "USER"
        SET IS_DELETED = 'T'
        WHERE USER_ID = :userId
        `;

        const binds = {
            userId: userId
        }

        await execute(sql,binds);

        return await userController.getUserById(userId);

    }catch (error) {
        errors.push(`While deleting admin got ${error.message}`);
        return 0;
    }
}

const deleteOrderPermanent = async (payload) => {
    try{
        errors.length = 0;
        const adminId = payload.adminId;
        const orderId = payload.orderId;

        const admin = await userController.getUserById(adminId);

        if(admin === null || admin.TYPE !== 'Admin'){
            errors.push(`Deletion permission denied`);
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
        errors.push(`While deleting order ${orderId}`);
        return null;
    }
}

const getBackUpStockOwns = async (payload) => {
    try{
        const adminId = payload.adminId;
        const admin = await userController.getUserById(adminId);

        if(admin === null || admin.TYPE !== 'Admin'){
            errors.push(`Access denied`);
            return null;
        }

        let field = payload.field;

        if(!(field === 'SYMBOL' || field === 'AVAILABLE_LOTS' || field === 'BLOCKED')){
            field = 'AVAILABLE_LOTS';
        }

        let order = payload.order;

        if(!(order === `ASC` || order === `DESC`)){
            order = `DESC`;
        }

        const sql = `
        SELECT *
        FROM "BACKUP STOCK"
        ORDER BY ${field} ${order}
        `;

        const backUpStock = await execute(sql,{});

        return backUpStock.rows;

    }catch(err){
        errors.push(`Found ${err.message} while getting backup stock data...`);
        return null;
    }
} 

module.exports = {
    getBackUpStockOwns,
    getAllCustomerInfo,
    updateStock,
    block,
    getDailyProfit,
    getAllEmployeeNames,
    getAllEmployeeDetailsByFullname,
    getAllUserNameAndType,
    addAdmin,
    deleteUser,
    deleteOrderPermanent,
    getAdminErrors
}