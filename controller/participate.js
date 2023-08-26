const db = require('../config/database.js');
const userController  = require('/user');    

const setParticipation = async (payload) => {
    try{
        const user = await userController.getUserById(payload.USER_ID);
        if(user.TYPE == 'Customer'){
            
        }

    }catch(err){
        console.log(`Found error: ${err.message} while setting participation...`);
        return null;
    }
}



module.exports = {
    participateStatus
}