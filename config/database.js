const oracledb = require("oracledb");
oracledb.autoCommit = true;

// database init
async function init() {
    console.log("DB init...");
    await oracledb.createPool({
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        connectString: process.env.DB_CONNECT_STRING,
        poolMin: 4,
        poolMax: 10,
        poolIncrement: 1
    });    

    oracledb.outFormat = oracledb.OBJECT;

    console.log('DB connected...');
}

// database close
async function close () {
    console.log('Closing db...');
    try{
        await oracledb.getPool().close(0);
        console.log('DB closed successfully...');
    }catch(err){
        console.log(`Found error : ${err.message} while closing db...`);
    }
}

// execute sql statements
async function execute(sql,binds) {
    let conn,results;
    try{
        conn = await oracledb.getConnection();
        results = await conn.execute(sql,binds);
        return results;
    }catch(err){
        console.error(`Error executing SQL: ${err.message}.\nSQL: ${sql}`);
        throw err;
    }finally{
        if(conn){
            try{
                await conn.close();
            }catch(err){
                console.error(`Error closing connection: ${err.message}.`);
            }
        }
    }
}

async function executeMany(sql, binds) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.executeMany(sql, binds);
        return result;
    } catch (err) {
        console.error(`Error executing SQL: ${err.message}.\nSQL: ${sql}`);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(`Error closing connection: ${err.message}.`);
            }
        }
    }
}



module.exports = {init,close,execute,executeMany}
