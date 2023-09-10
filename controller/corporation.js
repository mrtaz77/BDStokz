const db = require('../config/database.js');
const oracledb = require('oracledb');
const userController = require('./user');
const {
    getBlockedStatusBySymbol,
    getAllStockDataBySymbol
} = require('./stock');

let errors = [];

async function getCorporationErrors(){
    return errors;
}


const regStock = async (payload) => {
    try{
        errors.length = 0;
        const symbol = payload.symbol;
        const is_blocked = await getBlockedStatusBySymbol(symbol);

        if(is_blocked === 'T' || is_blocked === 'F'){
            errors.push(`Stock symbol ${symbol} is already registered`);
            return null;
        }

        errors.length = 0;

        const corpId =  payload.corpId;

        let corporation = await userController.getUserById(corpId);

        if(corporation === null){
            errors.push(`Corporation must be registered`);
            return null;
        }

        if(corporation.TYPE !== 'Corp'){
            errors.push(`Only a corporation can register stock`);
            return null;
        }

        console.log(corporation.NAME);

        const corpProfile = await userController.getProfileByName(corporation.NAME);

        if(corpProfile[0].SYMBOL !== null){
            errors.push(`Corporation already has a symbol ${corpProfile.SYMBOL}`);
            return null;
        }


        const price = payload.price;
        const available_lots = payload.available_lots;
        const lot = payload.lot;

        if(price <= 0 || available_lots < 0 || lot < 0){
            errors.push(`Invalid amount...`);
            return null;
        }

        const sql = `
            INSERT INTO STOCK (SYMBOL,CORP_ID,VALUE,LTP,PRICE,AVAILABLE_LOTS,LOT,BLOCKED)
            VALUES(UPPER(:symbol),:corp_id,:value,:ltp,:price,:available_lots,:lot,:blocked)
        `;

        const binds = {
            symbol : symbol,
            corp_id : corpId,
            price : price,
            available_lots : available_lots,
            lot : lot,
            blocked : `F`,
            value : 0.7 * price,
            ltp : 0
        };

        //set value to 70 percent


        await db.execute(sql,binds);

        stock = await getAllStockDataBySymbol({symbol:symbol});

        return stock;
    }catch(error){
        errors.push(`Found ${error.message} while registering stock`);
        return null;
    }
}

module.exports = {
    getCorporationErrors,
    regStock
}