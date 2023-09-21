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
        SELECT 
            ADMIN_LOG_ID,
            EVENT_TYPE,
            DESCRIPTION,
            FORMAT_TIMESTAMP_ORDER(EVENT_TIME) EVENT_TIME 
        FROM ADMIN_LOG 
        ORDER BY ADMIN_LOG_ID DESC
        `;

        const result = await execute(sql,{});
        return result.rows;

    }catch(error){
        errors.push(`Found ${error.message} while getting admin logs...`);
        return null;
    }
}

const getUserLogsById = async (userId) => {
    try{
        console.log(`Getting ${userId} logs`);
        errors.length = 0;

        const user = await userController.getUserById(userId);

        if(user === null) {
            errors.push(`Permission denied`);
            return null;
        }

        const sql = `
        SELECT EVENT_TYPE,DESCRIPTION,
        FORMAT_TIMESTAMP_ORDER(EVENT_TIME) EVENT_TIME
        FROM USER_LOG
        WHERE USER_ID = :user_id 
        ORDER BY USER_LOG_ID DESC
        `;

        const result = await execute(sql,{user_id:userId});
        return result.rows;

    }catch(error){
        errors.push(`Found ${error.message} while getting user logs...`);
        return null;
    }
}

const insertUserLog = async (payload) => {
    try {
        errors.length = 0;
        const userId = payload.userId;
        const eventType = payload.eventType;
        const description = payload.description;
        if(userId === null || eventType === null || description === null ){
            errors.push(`Insufficient info for user log`);
            return `FAILED`;
        };
        const sql = `
        INSERT INTO USER_LOG (USER_ID,EVENT_TYPE,DESCRIPTION) 
        VALUES (:user_id,:event_type,:description) 
        `;

        const binds = {
            user_id : userId,
            event_type : eventType,
            description : description
        };

        await execute(sql,binds);
        return `SUCCESS`;

    }catch(error){
        errors.push(`Found ${error.message} while getting user logs...`);
        return `FAILED`;
    }
}

const insertAdminLog = async (payload) => {
    try {
        errors.length = 0;
        const eventType = payload.eventType;
        const description = payload.description;
        if(eventType === null || description === null ){
            errors.push(`Insufficient info for admin log`);
            return `FAILED`;
        };
        const sql = `
        INSERT INTO ADMIN_LOG (EVENT_TYPE,DESCRIPTION) 
        VALUES (:event_type,:description) 
        `;

        const binds = {
            event_type : eventType,
            description : description
        };

        await execute(sql,binds);
        return `SUCCESS`;

    }catch(error){
        errors.push(`Found ${error.message} while getting admin logs...`);
        return `FAILED`;
    }
}

module.exports = {
    getAllAdminLogs,
    getUserLogsById,
    getLogErrors,
    insertUserLog,
    insertAdminLog
}

