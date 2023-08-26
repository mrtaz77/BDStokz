const db = require('../config/database.js');
const userController = require('./user');

const getAllInfoByID = async(id) =>{
    try{
        const sql = `
        SELECT * FROM CUSTOMER WHERE ID = :id
        `;

        const bind = {
            id: id,
        }

        const result = await db.execute(sql,bind);
        return result;
    }catch(err){
        console.log(`Found error: ${err.message} while getting info of ${id}`);
    }
} 

module.exports = {
    getAllInfoByID
}