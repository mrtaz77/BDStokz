const oracledb = require('oracledb');
const db = require('../config/database.js');
const validations = require('../util/validation');

const getPwdHash = async (pwd) => {
    const sql = `
    BEGIN 
        :pwdHash := PWD_HASH(:pwd);
    END;
    `;

    binds = {
        pwd : pwd,
        pwdHash : { type: oracledb.STRING, dir: oracledb.BIND_OUT }
    }

    const hash = await db.execute(sql, binds);
    // console.log(hash);
    // console.log(hash.outBinds.pwdHash);
    return hash.outBinds.pwdHash;
}

const getUserByEmail = async (payload) => {
    console.log(payload);
    const email = payload.email;
    console.log(`Fetching ${payload.email}...`);
    const sql = `
    SELECT USER_ID,NAME,EMAIL,"TYPE",(STREET_NO||' '||STREET_NAME||', '||CITY||', '||COUNTRY) ADDRESS,ZIP
    FROM "USER"
    WHERE EMAIL = :email
    `;
    const binds = {
        email: email
    };

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            console.log(`User ${email} does not exist`);
            return null;
        }
        return result.rows[0];
    }catch(err){
        console.error(`Found error: ${err} while searching id ${email}`);
    }
}

const getUserByName = async (payload) => {
    console.log(payload);
    const name = payload.name;
    console.log(`Fetching ${name}...`);
    const sql = `
    SELECT USER_ID,NAME,EMAIL,"TYPE",(STREET_NO||' '||STREET_NAME||', '||CITY||', '||COUNTRY) ADDRESS,ZIP
    FROM "USER"
    WHERE NAME = :name
    `;
    const binds = {
        name: name
    };

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            console.log(`User ${name} does not exist`);
            return null;
        }
        return result.rows[0];
    }catch(err){
        console.error(`Found error: ${err} while searching user ${name}`);
    }

}




const getUserByContact = async (contact) => {
    console.log(`Fetching ${contact}...`);
    const sql = `
    SELECT USER_ID
    FROM USER_CONTACT 
    WHERE CONTACT = :contact
    `;
    const binds = {
        contact: contact
    };

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            console.log(`Contact ${contact} does not exist`);
            return null;
        }
        return result.rows[0];
    }catch(err){
        console.error(`Found error: ${err} while searching user ${contact}`);
    }

}

const getUserByID = async (idP) => {
    const id = idP;
    console.log(`Fetching ${idP}...`);
    const sql = `
    SELECT USER_ID,NAME,EMAIL,"TYPE",(STREET_NO||' '||STREET_NAME||', '||CITY||', '||COUNTRY) ADDRESS,ZIP
    FROM "USER"
    WHERE USER_ID = :id
    `;
    const binds = {
        id: id
    };

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            console.log(`User ${id} does not exist`);
            return null;
        }
        return result.rows[0];
    }catch(err){
        console.error(`Found error: ${err} while searching user ${id}`);
    }

}


const createUser = async (payload) => {
    let errors = [];
    console.log(`In create user ${payload}`);
    // necessary user table checks
    const resultByName  = await getUserByName(payload);
    const resultByEmail = await getUserByEmail(payload);

    if(resultByName > 0){
        errors.push(`Username already in use...`);
    }

    if(resultByEmail > 0){
        errors.push(`Email already in use...`);
    }

    if(payload.pwd !== payload.confirmPwd){
        errors.push(`Password confirmation failed`);
    }

    if(payload.pwd.length < 8){
        errors.push(`Password must be at least 8 characters long`);
    }

    if(!validations.validateEmail(payload.email)){
        errors.push(`Email invalid`);
    }

    if(payload.city === null || payload.country === null || payload.zip === null){
        errors.push(`Invalid address info provided`);
    }

    if(!(payload.type == 'Customer' || payload.type == 'Broker' || payload.type == 'Corp')){
        // console.log(`type ${payload.type}`);
        errors.push(`Unknown user type ${payload.type}`);
    }
    // console.log(payload.contact)

    for (const contactElement of payload.contact){
        let resultByContact = await getUserByContact(contactElement);
        if(resultByContact > 0){
            errors.push(`Contact already in use...`);
        }

        if(!validations.validateContact(contactElement)){
            errors.push(`Contact invalid`);
        }
    }
    console.log(`Error: ${errors}`);
    if(errors.length > 0){
        return null;
    }else{
        switch(payload.type){
            case "Customer":
                await createCustomer(payload);
                break;
            case "Broker":
                await createBroker(payload);
                break;
            case "Corp":
                await createCorp(payload);
                break;
        }

        
        const result = await getUserByName(payload);
        return result;
    }
}

const chkAccountOfCustomer = async (accountNo) => {
    const sql = `
        SELECT 
            ACCOUNT_NO
        FROM 
            CUSTOMER 
        WHERE ACCOUNT_NO = :accountNo
    `;

    const binds = {
        accountNo: accountNo
    }

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            console.log(`Account No ${accountNo} does not exist`);
            return null;
        }
        return result.rows[0];
    }catch(err){
        console.error(`Found error: ${err} while searching account ${accountNo}`);
    }
}

const chkLicenseOfBroker = async (licenseNo) => {
    const sql = `
        SELECT 
            LICENSE_NO
        FROM 
            CUSTOMER 
        WHERE LICENSE_NO = :licenseNo
    `;

    const binds = {
        licenseNo: licenseNo
    }

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            console.log(`License No ${licenseNo} does not exist`);
            return null;
        }
        return result.rows[0];
    }catch(err){
        console.error(`Found error: ${err} while searching license ${licenseNo}`);
    }
}

const chkRegOfCorp = async (corpRegNo) => {
    const sql = `
        SELECT 
            CORP_REG_NO
        FROM 
            CORPORATION 
        WHERE CORP_REG_NO = :corpRegNo
    `;

    const binds = {
        corpRegNo: corpRegNo
    }

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            console.log(`CorpReg No ${corpRegNo} does not exist`);
            return null;
        }
        return result.rows[0];
    }catch(err){
        console.error(`Found error: ${err} while searching license ${corpRegNo}`);
    }
}



async function createCustomer (payload) {
    console.log(`In create customer ${payload}`);
    try{
        if(payload.refererId !== null && await getUserByID(payload.refererId) == null){
            console.log(`Customer ${payload.refererId} not registered`);
            return;
        }
        if(payload.brokerId !== null && await getUserByID(payload.brokerId) == null){
            console.log(`Broker ${payload.brokerId} not registered`);
            return;
        }

        if(await chkAccountOfCustomer(payload.accountNo) != null){
            console.log(`Account already in use`);
            return;
        }
        const pwdHash = await getPwdHash(payload.pwd);

        const userSql=`
        insert into "USER" (NAME, PWD, EMAIL, "TYPE", STREET_NO, STREET_NAME, CITY , COUNTRY, ZIP) values(
            :name, :pwd, :email, :type, :streetNo, :streetName, :city, :country, :zip
        )
        `;

        const userBinds = {
            name : payload.name,
            pwd : pwdHash,
            email : payload.email,
            type : payload.type,
            streetNo : payload.streetNo,
            streetName : payload.streetName,
            city : payload.city,
            country : payload.country,
            zip : payload.zip
        }
        

        await db.execute(userSql,userBinds);

        const customerSql = `
            insert into CUSTOMER (USER_ID, ACCOUNT_NO, REFERER_ID, BROKER_ID) values(
                (SELECT USER_ID FROM "USER" WHERE NAME = :name),:accountNo,:refererId,:broKerId
            )
        `;
        
        const customerBinds = {
            name : payload.name,
            accountNo : payload.accountNo,
            refererId : payload.refererId,
            brokerId : payload.brokerId
        }

        await db.execute(customerSql,customerBinds);


        for (const contactElement of payload.contact){
            const conSql = `
            insert into USER_CONTACT values (
                (SELECT USER_ID FROM "USER" WHERE NAME = :name),:contact
            )
            `;

            const conBinds = {
                name : payload.name,
                contact : contactElement
            }

            await db.execute(conSql,conBinds);
        }
        console.log(`After inserting name`);
        console.log(await getUserByName(payload.name));

    }catch(err){
        console.log(`Failed to create ${payload} for error ${err}`);
    }
}

async function createBroker (payload) {
    console.log(`Creating ${payload} broker `);
    try{
        if(await chkLicenseOfBroker(payload.licenseNo) != null ){ 
            console.log(`License ${payload.licenseNo} already exists`);
            return;
        }

        const pwdHash = await getPwdHash(payload.pwd);

        const userSql=`
        insert into "USER" (NAME, PWD, EMAIL, "TYPE", STREET_NO, STREET_NAME, CITY , COUNTRY, ZIP) values(
            :name, :pwd, :email, :type, :streetNo, :streetName, :city, :country, :zip
        )
        `;

        const userBinds = {
            name : payload.name,
            pwd : pwdHash,
            email : payload.email,
            type : payload.type,
            streetNo : payload.streetNo,
            streetName : payload.streetName,
            city : payload.city,
            country : payload.country,
            zip : payload.zip
        }

        await db.execute(userSql,userBinds);
        
        const brokerSql = `
        insert into BROKER (USER_ID, LICENSE_NO, COMMISSION_PCT, EXPERTISE) values(
            (SELECT USER_ID FROM "USER" WHERE NAME = :name),:licenseNo,:commissionPCT,:expertise
        )
        `;

        const brokerBinds = {
            name : payload.name,
            licenseNo : payload.licenseNo,
            commissionPCT : payload.commissionPCT,
            expertise : payload.expertise
        }

        await db.execute(brokerSql,brokerBinds);

        for (const contactElement of payload.contact){
            const conSql = `
            insert into USER_CONTACT values (
                (SELECT USER_ID FROM "USER" WHERE NAME = :name),:contactElement
            )
            `;

            const conBinds = {
                name : payload.name,
                contactElement : contactElement
            }

            await db.execute(conSql,conBinds);
        }

    }catch(err){
        console.log(`Failed to create ${payload} for error ${err}`);
    }
}

async function createCorp (payload) {
    console.log(`Creating ${JSON.stringify(payload)} corporation`);
    try{
        if(await chkRegOfCorp(payload.corpRegNo) !== null){
            console.log(`Reg no ${payload.corpRegNo} already exists`);
            return;
        }

        if(payload.sector == null){
            console.log(`Corporation sector must be specified`);
            return;
        }

        const pwdHash = await getPwdHash(payload.pwd);

        const userSql=`
        insert into "USER" (NAME, PWD, EMAIL, "TYPE", STREET_NO, STREET_NAME, CITY , COUNTRY, ZIP) values(
            :name, :pwd, :email, :type, :streetNo, :streetName, :city, :country, :zip
        )
        `;

        const userBinds = {
            name : payload.name,
            pwd : pwdHash,
            email : payload.email,
            type : payload.type,
            streetNo : payload.streetNo,
            streetName : payload.streetName,
            city : payload.city,
            country : payload.country,
            zip : payload.zip
        }

        await db.execute(userSql,userBinds);

        const corpSql = `
        insert into CORPORATION (CORP_ID, CORP_REG_NO, SECTOR) values (
            (SELECT USER_ID FROM "USER" WHERE NAME = :name),:corpRegNo,:sector
        )
        `;

        const corpBinds = {
            name : payload.name,
            corpRegNo : payload.corpRegNo,
            sector : payload.sector
        }

        await db.execute(corpSql,corpBinds);

        for (const contactElement of payload.contact){
            const conSql = `
            insert into USER_CONTACT values (
                (SELECT USER_ID FROM "USER" WHERE NAME = :name),:contactElement
            )
            `;

            const conBinds = {
                name : payload.name,
                contactElement : contactElement
            }

            await db.execute(conSql,conBinds);
        }


    }catch(err){
        console.log(`Failed to create ${payload} for error ${err}`);
    }
}

module.exports = {
    getPwdHash,
    getUserByEmail,
    getUserByName,
    getUserByContact,
    createUser,
    createCustomer,
    createBroker,
    createCorp
};