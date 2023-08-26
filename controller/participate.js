const db = require('../config/database.js');
const userController  = require('./user');    
const customerController = require('./customer');

const setParticipation = async  (payload) => {
    try{
        const user = await userController.getUserById(payload.userId);
        if(user.type == 'Customer'){
            const getCustomer = await getAllInfoByID(payload.userId);
            const referCount = getCustomer.REFER_COUNT;

            console.log(`referCount: ${getCustomer.REFER_COUNT} and PMT_STATUS: ${getCustomer.PMT_STATUS}`);
            if(referCount > 3 && payload.pmtStatus == 'Not paid'){
                payload.pmtStatus = 'Paid';
                console.log(payload.pmtStatus);
            }
        }

        const sql = `
        insert into PARTICIPATION (ACTIVITY_ID, USER_ID, PMT_STATUS) values (:activity_id, :user_id, :pmt_status)
        `;

        const binds = {
            user_id : payload.userId,
            activity_id : payload.activityId,
            pmt_status : payload.pmtStatus
        };
        
        await db.execute(sql, binds);

        const result = await getParticipation(payload);

        return result;

    }catch(err){
        console.log(`Found error: ${err.message} while setting participation...`);
        return null;
    }
}

const getParticipation = async(payload) => {
    try{
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
        
        return results;

    }catch(err){
        console.log(`Found error: ${err.message} while getting participation...`);
        return null;
    }
}

const updatePmtStatus = async(payload) => {
    try{
        const sql = `
        UPDATE participation
        SET PMT_STATUS = :pmt_status
        WHERE ACTIVITY_ID = :activity_id AND USER_ID = :user_id
        `;

        const binds = {
            user_id : payload.userId,
            activity_id : payload.activityId,
            pmt_status : payload.pmtStatus
        };

        await db.execute()

    }catch(err){
        console.log(`Found error: ${err.message} while updating participation...`);
        return null;
    }
}



module.exports = {
    setParticipation,
    getParticipation,
    updatePmtStatus
}