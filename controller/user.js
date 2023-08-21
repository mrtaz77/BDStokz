const oracledb = require('oracledb');
const db = require('../config/database.js');

const getPwdHash = async (pwd) => {
    console.log(`Get PWD Hash from ${pwd}`); 

    const sql = `
    BEGIN 
        :pwdHash := PWD_HASH(:pwd);
    END;
    `;

    binds = {
        pwd : pwd,
        pwdHash : { type: oracledb.STRING, dir: oracledb.BIND_OUT }
    }

    const hash = await db.execute(sql, binds);
    console.log(hash);
    console.log(hash.outBinds.pwdHash);
    return hash.outBinds.pwdHash;
}

const getUserById = async (payload) => {
    console.log(payload);
    const user_id = payload.user_id;
    console.log(`Fetching ${payload.user_id}...`);
    const sql = `
    SELECT USER_ID,NAME,EMAIL,"TYPE",(STREET_NO||' '||STREET_NAME||', '||CITY||', '||COUNTRY) ADDRESS,ZIP
    FROM "USER"
    WHERE USER_ID = :user_id
    `;
    const binds = {
        user_id: user_id
    };

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            console.log(`User ${user_id} does not exist`);
            return null;
        }
        return result.rows[0];
    }catch(err){
        console.error(`Found error: ${err} while searching id ${user_id}`);
    }
}

const getUserByName = async (payload) => {
    console.log(payload);
    const name = payload.name;
    console.log(`Fetching ${name}...`);
    const sql = `
    SELECT USER_ID,NAME,EMAIL,"TYPE",(STREET_NO||' '||STREET_NAME||', '||CITY||', '||COUNTRY) ADDRESS,ZIP
    FROM "USER"
    WHERE NAME = :name
    `;
    const binds = {
        name: name
    };

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            console.log(`User ${name} does not exist`);
            return null;
        }
        return result.rows[0];
    }catch(err){
        console.error(`Found error: ${err} while searching user ${name}`);
    }

}


module.exports = {getPwdHash,getUserById,getUserByName};