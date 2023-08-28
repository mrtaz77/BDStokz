import { execute } from '../config/database.js';
import { getUserByID } from './user';

const getAllInfoByID = async(id) =>{
    try{
        const sql = `
        SELECT * FROM CUSTOMER WHERE ID = :id
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
        const type = getUserByID(id).TYPE;
        console.log(type);

        if(type == 'Customer'){
            const sql = `
            SELECT 
                (SELECT NAME FROM "USER"  WHERE "USER".USER_ID = :id) NAME,
                SECTOR,
                BUY_AMOUNT,
                SELL_AMOUNT,
                CASH_AMOUNT
            FROM PORTFOLIO
            WHERE USER_ID = :id
            `;

            const binds = {
                id: id
            };

            return await execute(sql, binds);

        }else{
            console.log(`${id} is not a customer`);
        }

    }catch(err){
        console.log(`Found error: ${err.message} while getting portfoio of ${id}`);
    }
}

export default {
    getAllInfoByID,
    getPortfolioInfoByID
}