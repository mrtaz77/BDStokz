const { execute } = require('../config/database');
const { getUserById } = require('./user');
let errors = [];

async function getBrokerErrors(){
    return errors;
}

const getCustomersOfBroker = async (id) => {
    try{
        errors.length = 0;
        const result = await getUserById(id);
        const type = result.TYPE;

        if(type == 'Broker'){
            const sql = `
            SELECT
                NAME 
            FROM
                CUSTOMER LEFT OUTER
                JOIN "USER" ON "USER".USER_ID = CUSTOMER.USER_ID 
            WHERE
                BROKER_ID = :broker_id
                AND CUSTOMER.IS_DELETED = 'F' 
                AND "USER".IS_DELETED = 'F'
            ORDER BY
                NAME
            `;

            const binds = {
                broker_id: id
            };

            const customers =  await execute(sql, binds);
            return customers.rows;

        }else{
            errors.push(`${id} is not a broker`);
            return null;
        }

    }catch(err){
        errors.push(`Found error: ${err.message} while getting customers of ${id}`);
        return null;
    }
}

const getAllBrokers = async () => {
    try{
        errors.length = 0;

        
        const sql = `
        SELECT
            NAME
        FROM
            BROKER LEFT OUTER
            JOIN "USER" ON "USER".USER_ID = BROKER.USER_ID 
        WHERE
            BROKER.IS_DELETED = 'F' 
            AND "USER".IS_DELETED = 'F' 
        ORDER BY
            NAME
        `;

        const brokers =  await execute(sql, {});
        return brokers.rows;

    }catch(err){
        errors.push(`Found error: ${err.message} while getting brokers}`);
        return null;
    }
}

module.exports = {
    getCustomersOfBroker,
    getBrokerErrors,
    getAllBrokers
}