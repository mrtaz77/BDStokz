// node-oracleDb add-on for Node.js powers high performance Oracle Database applications
var oracleDb = require('oracledb');

module.exports.connect = async() => {
    await oracleDb.createPool({
        user: 'C##STOCKDB',
        password: '13579',
        connectString : 'localhost:1521/ORCL',
        poolMin: 1,
        poolMax: 100,
        poolIncrement : 5,
    });

    oracleDb.autoCommit = true;
    oracleDb.outFormat = oracleDb.OBJECT;

    console.log('config/stockDb: Successfully connected to oracle database')

    const checkSchema =`SELECT DISTINCT
                            table_name, COUNT(column_name) FIELD_COUNT
                        FROM all_tab_columns 
                        WHERE owner = \'C##STOCKDB\' 
                        GROUP BY table_name
                        ORDER BY table_name`;
    const con = await oracleDb.getConnection();

    con.execute(checkSchema,[],(e,r) => {
        if(e){
            console.error(e);
        }
        else{
            console.log(r.rows);
        }
    });
};

module.exports.getConnection = async () => {
    await oracleDb.getConnection();
};

module.exports.close = async () => {
    await oracleDb.getPool().close(0);
}


