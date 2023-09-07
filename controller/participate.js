const db = require('../config/database.js');
const userController  = require('./user');    
const activityController = require('./activity');

let errors = [];

async function getParticipationErrors(){
    return errors;
}

const setParticipation = async  (payload) => {
    try{
        errors.length = 0;
        const user = await userController.getUserById(payload.userId);
        const activity = await activityController.getActivityById(payload.activityId);
        if(user == null || activity == null){
            errors.push(`Invalid registration...`);
            return null;
        }

        const sql = `
        insert into PARTICIPATION (ACTIVITY_ID, USER_ID) values (:activity_id, :user_id)
        `;

        const binds = {
            user_id : payload.userId,
            activity_id : payload.activityId
        };
        
        await db.execute(sql, binds);

        return await getParticipation(payload);

    }catch(err){
        errors.push(`Found error: ${err.message} while setting participation...`);
        return null;
    }
}

const getParticipation = async(payload) => {
    try{
        errors.length = 0;
        const sql = `
        SELECT * 
        FROM participation 
        WHERE ACTIVITY_ID = :activity_id 
        AND USER_ID = :user_id
        `;

        const binds = {
            user_id : payload.userId,
            activity_id : payload.activityId
        };

        const results = await db.execute(sql, binds);

        // console.log(results.rows);
        
        return results.rows;

    }catch(err){
        errors.push(`Found error: ${err.message} while getting participation...`);
        return null;
    }
}


module.exports = {
    setParticipation,
    getParticipation,
    getParticipationErrors
}