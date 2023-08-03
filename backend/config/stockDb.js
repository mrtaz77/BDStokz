// node-oracledb add-on for Node.js powers high performance Oracle Database applications
var oracleDb = require('oracledb');

module.exports.connect = async() => {
    await oracleDb.createPool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString : process.env.DB_CONNECT_STRING,
        poolMin: 1,
        poolMax: 100,
        poolIncrement : 5,
    });

    oracleDb.autoCommit = true;
    oracleDb.outFormat = oracleDb.OBJECT;

    console.log('config/stockDb: Successfully connected to oracle database')
};

module.exports.getConnection = async () => {
    await oracleDb.getConnection();
};

module.exports.close = async () => {
    await oracleDb.getPool().close(0);
}


