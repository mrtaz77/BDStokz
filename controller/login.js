const oracledb = require('oracledb');
const db = require('../config/database.js');

const jwt = require('jsonwebtoken');
const {getUserByName} = require('./user.js');

const getToken = async (payload) => {
    console.log(`Getting token: ${JSON.stringify(payload)} from login.js...`);

    const sql = `
    BEGIN 
        :checkCreds := CHK_CREDS(:name, :pwd);
    END;
    `;

    binds = {
        name : payload.name,
        pwd : payload.pwd,
        checkCreds : {type: oracledb.NUMBER, dir: oracledb.BIND_OUT}
    }

    const result = await db.execute(sql, binds);
    console.log(result)
    const checkCreds = result.outBinds.checkCreds;
    console.log(checkCreds);

    if(checkCreds === -404){
        console.log(`username or password invalid`);
        return null;
    }

    const user = await getUserByName({ name : payload.name });

    const accessToken = jwt.sign({name: payload.name, user_id: user.user_id}, process.env.JWT_SECRET);
    return {user,accessToken};
}

module.exports = getToken;