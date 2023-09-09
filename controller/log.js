const {execute} = require('../config/database');
const userController = require('./user');
let errors = [];

async function getLogErrors(){
    return errors;
}

const getAllAdminLogs = async (userId) => {
    try{
        errors.length = 0;

        const user = await userController.getUserById(userId);

        if(user.TYPE !== 'Admin'){
            errors.push(`Permission denied`);
            return null;
        }

        const sql = `
        SELECT *
        FROM ADMIN_LOG 
        ORDER BY EVENT_TIME DESC ,ADMIN_LOG_ID DESC
        `;

        const result = await execute(sql,{});
        return result.rows;

    }catch(error){
        errors.push(`Found ${err.message} while getting admin logs...`);
        return null;
    }
}

const getUserLogsById = async (userId) => {
    try{
        errors.length = 0;

        const user = await userController.getUserById(userId);

        if(user === null) {
            errors.push(`Permission denied`);
            return null;
        }

        const sql = `
        SELECT EVENT_TYPE,DESCRIPTION,EVENT_TIME
        FROM USER_LOG 
        ORDER BY EVENT_TIME DESC , USER_LOG_ID DESC
        `;

        const result = await execute(sql,{});
        return result.rows;

    }catch(error){
        errors.push(`Found ${err.message} while getting user logs...`);
        return null;
    }
}

module.exports = {
    getAllAdminLogs,
    getUserLogsById,
    getLogErrors
}