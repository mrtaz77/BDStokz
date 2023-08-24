const db = require('../config/database.js');

const getUpcomingActivities = async (payload) => {
    console.log(payload); 

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
        "DATE" > SYSDATE
    ORDER BY "DATE"
    `;

    const binds = {}

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            console.log(`No upcoming activities`);
            return null;
        }
        return result.rows;
    }catch(err){
        console.error(`Found error: ${err} while searching for stocks...`);
    }
}

module.exports = {getUpcomingActivities};