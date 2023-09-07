const db = require('../config/database.js');

let errors = [];

async function getActivityErrors(){
    return errors;
}

const getActivityById = async (activityId) => {
    errors.length = 0;
    try{
        const sql = `
        SELECT
            NAME ORGANIZER,
            TO_CHAR( "DATE", 'DD Month YYYY' ) EVENT_DATE,
            TIME_FORMAT ( START_TIME ) START_TIME,
            DURATION_FORMAT ( "DURATION(min)" ) DURATION,
            ACTIVITY."TYPE",
            VENUE,
            FEE,
            DESCRIPTION
        FROM
            ACTIVITY
            JOIN "USER" ON CORP_ID = USER_ID 
        WHERE
            ACTIVITY_ID = :activity_id 
        `;

        const binds = {
            activity_id : activityId
        }
        const result = await db.execute(sql, binds);
        return result;
    }catch(err){
        errors.push(`Found ${err.message} while getting info of ${activityId}...`);
        return null;
    }
}

const getUpcomingActivities = async (payload) => {
    errors.length = 0;
    console.log(payload); 

    const sql = `
    SELECT
        NAME ORGANIZER,
        TO_CHAR( "DATE", 'DD Month YYYY' ) EVENT_DATE,
        TIME_FORMAT ( START_TIME ) "START TIME",
        DURATION_FORMAT ( "DURATION(min)" ) DURATION,
        ACTIVITY."TYPE",
        VENUE,
        FEE,
        DESCRIPTION,
        ACTIVITY_ID
    FROM
        ACTIVITY
        JOIN "USER" ON CORP_ID = USER_ID 
    WHERE
        START_TIME > CURRENT_TIMESTAMP
    ORDER BY "DATE",START_TIME
    `;

    const binds = {}

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            errors.push(`No upcoming activities`);
            return null;
        }
        return result.rows;
    }catch(err){
        errors.push(`Found error: ${err} while searching for stocks...`);
        return null;
    }
}



module.exports = {
    getUpcomingActivities,
    getActivityById,
    getActivityErrors
};