const db = require('../config/database.js');
const oracledb = require('oracledb'); 

const getUserTypeByName = async (name) => {
    const sql = `
        SELECT 
            "TYPE" 
            FROM "USER"
            WHERE NAME = :name
    `;

    const binds = {
        name: name
    }

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            console.log(`No such user ${name} found`);
            return null;
        }
        console.log(result.rows[0].TYPE);
        return result.rows[0].TYPE;
    }catch(err){
        console.error(`Found error: ${err} while searching for user-type ${name}...`);
    }
}

const getUserLoginInfoByName = async (name) => {
    const sql = `
        SELECT 
            USER_ID,
            NAME,
            EMAIL,
            "TYPE"
        FROM "USER"
        WHERE NAME = :name
    `;

    const binds = {
        name : name
    }

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            console.log(`No such user ${name} found`);
            return null;
        }
        console.log(result.rows);
        return result.rows;
    }catch(err){
        console.error(`Found error: ${err} while searching for user ${name}...`);
    }
}

const chkCreds = async (name,password) => {
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

    console.log(`Got ${returnedValue} in login `);
    return returnedValue;
}


module.exports = {
    getUserLoginInfoByName,
    getUserTypeByName,
    chkCreds
};