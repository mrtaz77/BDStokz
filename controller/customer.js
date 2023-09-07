const { execute } = require('../config/database');
const { getUserById } = require('./user');

const getAllInfoByID = async(id) =>{
    try{
        const sql = `
        SELECT * FROM CUSTOMER WHERE ID = :id AND IS_DELETED = 'F'
        `;

        const bind = {
            id: id,
        }

        const result = await execute(sql,bind);
        return result;
    }catch(err){
        console.log(`Found error: ${err.message} while getting info of ${id}`);
    }
} 

const getPortfolioInfoByID = async(id) =>{
    try{
        const result = await getUserById(id);
        const type = result.TYPE;

        if(type == 'Customer'){
            const sql = `
            SELECT 
                (SELECT NAME FROM "USER"  WHERE "USER".USER_ID = :id AND IS_DELETED = 'F') NAME,
                SECTOR,
                BUY_AMOUNT,
                SELL_AMOUNT
            FROM PORTFOLIO
            WHERE USER_ID = :id
            ORDER BY SECTOR
            `;

            const binds = {
                id: id
            };

            const portfoio =  await execute(sql, binds);
            return portfoio.rows;

        }else{
            console.log(`${id} is not a customer`);
            return null;
        }

    }catch(err){
        console.log(`Found error: ${err.message} while getting portfoio of ${id}`);
    }
}

module.exports = {
    getAllInfoByID,
    getPortfolioInfoByID,
}