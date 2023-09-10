const db = require('../config/database.js');
const oracledb = require('oracledb'); 


let errors = [];

async function getLoginErrors(){
    return errors;
}

const getUserTypeByName = async (name) => {
    errors.length = 0;
    const sql = `
        SELECT 
        "TYPE" 
        FROM "USER"
        WHERE NAME = :name
        AND IS_DELETED = 'F'
    `;

    const binds = {
        name: name
    }

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            errors.push(`No such user ${name} found`);
            return null;
        }
        console.log(result.rows[0].TYPE);
        return result.rows[0].TYPE;
    }catch(err){
        errors.push(`Found error: ${err} while searching for user-type ${name}...`);
        return null;
    }
}



const getUserLoginInfoByName = async (name) => {
    errors.length = 0;
    const type = await getUserTypeByName(name);
    if(type == null){
        errors.push(`No such user ${name} found`);
        return null;
    }
    let sql;
    switch(type){
        case 'Admin':
            sql = `
            SELECT 
                USER_ID,
                NAME,
                EMAIL,
                "TYPE",
                (STREET_NO||' '||STREET_NAME||', '||CITY||', '||COUNTRY) ADDRESS,
                ZIP,
                ADDER_ID,
                EMPLOYEE_ID,
                FUNDS
            FROM "USER" JOIN ADMIN ON USER_ID = ADMIN_ID
            WHERE NAME = :name 
            AND "USER".IS_DELETED = 'F'   
            `;
            break;
        case 'Customer':
            sql = `
            SELECT 
                USER_ID,
                NAME,
                EMAIL,
                "TYPE",
                (STREET_NO||' '||STREET_NAME||', '||CITY||', '||COUNTRY) ADDRESS,
                ZIP,
                ACCOUNT_NO,
                REFERER_ID,
                REFER_COUNT,
                BROKER_ID
            FROM "USER" JOIN CUSTOMER USING (USER_ID)
            WHERE NAME = :name
            AND "USER".IS_DELETED = 'F' 
            `;
            break;
        case 'Broker':
            sql = `
            SELECT 
                USER_ID,
                NAME,
                EMAIL,
                "TYPE",
                (STREET_NO||' '||STREET_NAME||', '||CITY||', '||COUNTRY) ADDRESS,
                ZIP,
                LICENSE_NO,
                COMMISSION_PCT,
                EXPERTISE
            FROM "USER" JOIN BROKER USING (USER_ID)
            WHERE NAME = :name
            AND "USER".IS_DELETED = 'F' 
            `;
            break;
        case 'Corp':
            sql = `
            SELECT 
                USER_ID,
                NAME,
                EMAIL,
                "TYPE",
                (STREET_NO||' '||STREET_NAME||', '||CITY||', '||COUNTRY) ADDRESS,
                ZIP,
                CORP_REG_NO,
                SECTOR
            FROM "USER" NATURAL JOIN CORPORATION
            WHERE NAME = :name
            AND "USER".IS_DELETED = 'F' 
            `;
            break;
        default:
            sql = ``;
            break;
    }

    const binds = {
        name : name
    }

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            errors.push(`No such user ${name} found`);
            return null;
        }
        // console.log(result.rows);
        return result.rows;
    }catch(err){
        errors.push(`Found error: ${err} while searching for user ${name}...`);
        return null;
    }
}

const chkCreds = async (name,password) => {
    errors.length = 0;
    try{
        console.log(name);
        const sql = `
        BEGIN
            :result := CHK_CREDS_NAME(:name, :password);
        END;
        `;

        const binds = {
            result : { dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
            name: name,
            password: password
        };

        const result = await db.execute(sql, binds);

        const returnedValue = result.outBinds.result;

        // errors.push(`Got ${returnedValue} in login `);
        return returnedValue;
    }catch(err){
        errors.push(`Found error in credentials...`);
        return null;
    }
}


module.exports = {
    getUserLoginInfoByName,
    chkCreds,
    getUserTypeByName,
    getLoginErrors
};