const { execute } = require('../config/database');
const { getUserByID } = require('./user');
let errors = [];

async function getCustomerErrors(){
    return errors;
}


const getAllInfoByID = async(id) =>{
    try{
        errors.length = 0;
        const sql = `
        SELECT * FROM CUSTOMER WHERE ID = :id AND IS_DELETED = 'F'
        `;

        const bind = {
            id: id,
        }

        const result = await execute(sql,bind);
        return result;
    }catch(err){
        errors.push(`Found error: ${err.message} while getting info of ${id}`);
        return null;
    }
} 

const getPortfolioInfoByID = async(id) =>{
    try{
        errors.length = 0;
        const result = await getUserByID(id);
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
            errors.push(`${id} is not a customer`);
            return null;
        }

    }catch(err){
        errors.push(`Found error: ${err.message} while getting portfoio of ${id}`);
        return null;
    }
}

module.exports = {
    getAllInfoByID,
    getPortfolioInfoByID,
    getCustomerErrors
}