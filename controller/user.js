const oracledb = require('oracledb');
const db = require('../config/database.js');
const validations = require('../util/validation');
//const {getUserTypeByName} = require('./login');
const {getUserTypeByName,chkCreds} = require('./login');
const fields = require('../util/fields')
const {getAllStockDataBySymbol} = require('./stock')

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
    errors.length = 0;
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
            errors.push(`User ${email} does not exist`);
            return null;
        }
        console.log(result.rows);
        return result.rows;
    }catch(err){
        errors.push(`Found error: ${err} while searching id ${email}`);
        return null;
    }
}

const getUserByName = async (payload) => {
    errors.length = 0;
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
    errors.length = 0;
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
            //errors.push(`Contact ${contact} does not exist`);
            return null;
        }
        return result.rows[0];
    }catch(err){
        console.error(`Found error: ${err} while searching user ${contact}`);
    }

}

const getUserByID = async (idP) => {
    errors.length = 0;
    const id = idP;
    console.log(`Fetching ${idP}...`);
    const sql = `
    SELECT USER_ID,NAME,EMAIL,"TYPE",(STREET_NO||' '||STREET_NAME||', '||CITY||', '||COUNTRY) ADDRESS,ZIP
    FROM "USER"
    WHERE USER_ID = :id AND IS_DELETED = 'F'
    `;
    const binds = {
        id: id
    };

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){

            errors.push(`User ${id} does not exist`);
            return null;
        }
        return result.rows[0];
    }catch(err){
        console.error(`Found error: ${err} while searching user ${id}`);
        return null;
    }

}

let errors = [];

 async function getErrors(){
    return errors;
 }
const createUser = async (payload) => {
    errors.length = 0;
    console.log(`In create user ${payload}`);
    // necessary user table checks
    const resultByName  = await getUserByName(payload);
    const resultByEmail = await getUserByEmail(payload);

    if(resultByName){
        errors.push(`Username already in use...`);
    }

    if(resultByEmail){
        errors.push(`Email already in use...`);
        console.log(`Username already in use...`);
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
    console.log(payload.contact)

    for (const contactElement of payload.contact){
        let resultByContact = await getUserByContact(contactElement);
        if(resultByContact > 0){
            errors.push(`Contact already in use...`);
        }

        if(!validations.validateContact(contactElement)){
            console.log(`Contact ${contactElement} ${validations.validateContact(contactElement)}`);
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
            //errors.push(`Account No ${accountNo} does not exist`);
            return null;
        }
        return result.rows[0];
    }catch(err){
        errors.push(`Found error: ${err} while searching account ${accountNo}`);
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
            errors.push(`License No ${licenseNo} does not exist`);
            return null;
        }
        return result.rows[0];
    }catch(err){
        errors.push(`Found error: ${err} while searching license ${licenseNo}`);
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
            errors.push(`CorpReg No ${corpRegNo} does not exist`);
            return null;
        }
        return result.rows[0];
    }catch(err){
        errors.push(`Found error: ${err} while searching license ${corpRegNo}`);
    }
}


async function createCustomer (payload) {
    console.log(`In create customer ${payload}`);
    try{
        if(payload.refererName !== null){
            console.log('getting referer');
            const referer = await getUserByName({name:payload.refererName}) ;
            if(referer === null){
                errors.push(`Customer ${payload.refererName} not registered`);
                return;
            }
            if(referer.TYPE !== 'Customer'){
                errors.push(`Only a customer can refer site to someone`);
                return;
            }
        }


        if(await chkAccountOfCustomer(payload.accountNo) != null){
            errors.push(`Account already in use`);
            console.log(`Account already in use`);
            return;
        }
        const pwdHash = await getPwdHash(payload.pwd);

        const insertPlSql = `
        BEGIN
            insert into "USER" (NAME, PWD, EMAIL, "TYPE", STREET_NO, STREET_NAME, CITY, COUNTRY, ZIP) values (
                :name, :pwd, :email, :type, :streetNo, :streetName, :city, :country, :zip
            );
            
            insert into CUSTOMER (USER_ID, ACCOUNT_NO, REFERER_ID, BROKER_ID) values (
                (SELECT USER_ID FROM "USER" WHERE NAME = :name), :accountNo, (SELECT USER_ID FROM "USER" WHERE NAME = :refererName), null
            );
            
            -- Loop for inserting contacts
            FOR i IN 1 .. :contact_count LOOP
                insert into USER_CONTACT values (
                    (SELECT USER_ID FROM "USER" WHERE NAME = :name), :contacts(i)
                );
            END LOOP;
        EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
        END;
        `;

        const userBinds = {
            name: payload.name,
            pwd: pwdHash,
            email: payload.email,
            type: payload.type,
            streetNo: payload.streetNo,
            streetName: payload.streetName,
            city: payload.city,
            country: payload.country,
            zip: payload.zip,
            accountNo: payload.accountNo,
            refererName: payload.refererName,
            contact_count: payload.contact.length,
            contacts: payload.contact
        };

        await db.execute(insertPlSql, userBinds);

        console.log(`After inserting name`);
        console.log(await getUserByName(payload));

    }catch(err){
        errors.push(`Failed to create ${payload} for error ${err}`);
        console.log(`Failed to create ${payload} for error ${err}`);
    }
}


async function createBroker (payload) {
    console.log(`Creating ${payload} broker `);
    try{
        if(await chkLicenseOfBroker(payload.licenseNo) != null ){ 
            errors.push(`License ${payload.licenseNo} already exists`);
            return;
        }

        const pwdHash = await getPwdHash(payload.pwd);

        const insertplSql=`
        BEGIN
        insert into "USER" (NAME, PWD, EMAIL, "TYPE", STREET_NO, STREET_NAME, CITY , COUNTRY, ZIP) values(
            :name, :pwd, :email, :type, :streetNo, :streetName, :city, :country, :zip
        );
        insert into BROKER (USER_ID, LICENSE_NO, COMMISSION_PCT, EXPERTISE) values(
            (SELECT USER_ID FROM "USER" WHERE NAME = :name),:licenseNo,0.01,:expertise
        );
        -- Loop for inserting contacts
        FOR i IN 1 .. :contact_count LOOP
            insert into USER_CONTACT values (
                (SELECT USER_ID FROM "USER" WHERE NAME = :name), :contacts(i)
            );
        END LOOP;
        EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
        END;
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
            zip : payload.zip,
            licenseNo : payload.licenseNo,
            expertise : payload.expertise,
            contact_count: payload.contact.length,
            contacts: payload.contact
        };

        await db.execute(insertplSql, userBinds);

        console.log(`After inserting name`);
        console.log(await getUserByName(payload));

    }catch(err){
        errors.push(`Failed to create ${payload} for error ${err}`);
    }
}

async function createCorp (payload) {
    try{
        if(await chkRegOfCorp(payload.corpRegNo) !== null){
            errors.push(`Reg no ${payload.corpRegNo} already exists`);
            return;
        }

        if(payload.sector == null){
            errors.push(`Corporation sector must be specified`);
            return;
        }

        const pwdHash = await getPwdHash(payload.pwd);

        const insertplSql=`
        BEGIN
        insert into "USER" (NAME, PWD, EMAIL, "TYPE", STREET_NO, STREET_NAME, CITY , COUNTRY, ZIP) values(
            :name, :pwd, :email, :type, :streetNo, :streetName, :city, :country, :zip
        );
        insert into CORPORATION (CORP_ID, CORP_REG_NO, SECTOR) values (
            (SELECT USER_ID FROM "USER" WHERE NAME = :name),:corpRegNo,:sector
        );
        -- Loop for inserting contacts
        FOR i IN 1 .. :contact_count LOOP
            insert into USER_CONTACT values (
                (SELECT USER_ID FROM "USER" WHERE NAME = :name), :contacts(i)
            );
        END LOOP;
        EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
        END;
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
            zip : payload.zip,
            corpRegNo : payload.corpRegNo,
            sector : payload.sector,
            contact_count: payload.contact.length,
            contacts: payload.contact
        };

        await db.execute(insertplSql, userBinds);

        console.log(`After inserting name`);
        console.log(await getUserByName(payload));
    }catch(err){
        errors.push(`Failed to create ${payload} for error ${err}`);
    }
}

const isPrem = async (id) => {
    try{
        errors.length = 0;
        let prem;
        console.log(`id: ${id}`);
        const plSql = `
            DECLARE
                CHK CHAR(1);
            BEGIN
                IS_PREM(:ID, CHK);
                :flag := CHK;
            END;
        `;
        const bindFlag = {
            ID: id,
            flag: {
                dir: oracledb.BIND_OUT,
                type: oracledb.STRING,
                maxSize: 1
            }
        };
        prem = await db.execute(plSql, bindFlag);
        return prem.outBinds.flag;
    }catch(err){
        console.log(`Failed to get premium status of ${id} for error ${err}`);
    }
}
const getProfileByName = async (name) => {
    errors.length = 0;
    const type = await getUserTypeByName(name);
    if(type == null){
        errors.push(`No such user ${name} found`);
        return null;
    }
    let sql;
    switch(type){
        case 'Admin':
            sql = `
            SELECT 
                USER_ID,
                NAME,
                EMAIL,
                "TYPE",
                STREET_NO,STREET_NAME,CITY,COUNTRY,
                ZIP,
                (SELECT NAME FROM "USER" WHERE USER_ID = ADDER_ID) ADDER,
                EMPLOYEE_ID,
                FUNDS
            FROM "USER" JOIN ADMIN ON USER_ID = ADMIN_ID
            WHERE NAME = :name    
            `;
            break;
        case 'Customer':
            sql = `
            SELECT
                U.USER_ID,
                U.NAME,
                U.EMAIL,
                U."TYPE",
                U.STREET_NO, U.STREET_NAME,U.CITY,U.COUNTRY,
                U.ZIP,
                C.ACCOUNT_NO,
                ( SELECT NAME FROM "USER" WHERE USER_ID = C.REFERER_ID ) REFERER,
                C.REFER_COUNT,
                ( SELECT NAME FROM "USER" WHERE USER_ID = C.BROKER_ID ) BROKER 
            FROM
                "USER" U
                LEFT OUTER JOIN CUSTOMER C ON U.USER_ID = C.USER_ID 
            WHERE
                U.NAME = :name 
            `;
            break;
        case 'Broker':
            sql = `
            SELECT 
                USER_ID,
                NAME,
                EMAIL,
                "TYPE",
                STREET_NO,STREET_NAME,CITY,COUNTRY,
                ZIP,
                LICENSE_NO,
                COMMISSION_PCT,
                EXPERTISE,
                NVL((SELECT COUNT(*) FROM CUSTOMER WHERE BROKER_ID = USER_ID),0) NUM_OF_CUSTOMERS
            FROM "USER" NATURAL JOIN BROKER
            WHERE NAME = :name
            `;
            break;
        case 'Corp':
            sql = `
            SELECT
                USER_ID,
                NAME,
                SYMBOL,
                EMAIL,
                "TYPE",
                STREET_NO,STREET_NAME,CITY,COUNTRY,
                ZIP,
                CORP_REG_NO,
                SECTOR 
            FROM
                "USER"
                JOIN CORPORATION ON ( CORP_ID = USER_ID )
                NATURAL JOIN STOCK 
            WHERE NAME = :name
            `;
            break;
        default:
            sql = ``;
            break;
    }

    const binds = {
        name : name
    }

    try{
        const result = await db.execute(sql,binds);
        if(result.rows.length==0){
            errors.push(`No such user ${name} found`);
            return null;
        }
        //console.log(result.rows);
        return result.rows;
    }catch(err){
        console.error(`Found error: ${err} while searching for user ${name}...`);
    }
};

const getContactByName = async (name)=>{
    errors.length = 0;
    const sql = `
    SELECT CONTACT 
    FROM USER_CONTACT
    WHERE USER_ID = (SELECT USER_ID FROM "USER" WHERE NAME = :name)
    `;

    const bind = {
        name: name
    }

    try{
        const result = await db.execute(sql,bind);
        if(result.rows.length==0){
            errors.push(`No such user ${name} found`);
            return null;
        }
        console.log(result.rows);
        return result.rows;
    }catch(err){
        errors.push(`Found error: ${err} while getting contact for user ${name}...`);
        return null;
    }
}

const updateProfile = async (payload)=>{
    errors.length = 0;
    try{
        const userId = payload.userId;
        const field = payload.field;
        const newValue = payload.newValue;

        const user = await getUserByID(userId);
        //let errors = [];

        let sql;
        if(user == null){
            errors.push(`User does not exist.`);
        }

        if(fields.user.includes(field)){

            if(field == 'NAME'){
                const resultByName  = await getUserByName({name:newValue});
                if(resultByName != null){
                    errors.push("User name already exists...");
                }
            }
            else if(field == 'EMAIL'){
                const resultByEmail = await getUserByEmail({email:newValue});
                if(resultByEmail != null){
                    errors.push("Email already exists...");
                }
                if(!validations.validateEmail(newValue)){
                    errors.push("Email invalid");
                }
            }

            sql = `
            UPDATE "USER"
            SET ${field} = :newValue
            WHERE USER_ID = :userId
            `;

        }else if(fields.customer.includes(field)){
            if(field == `ACCOUNT_NO`){
                const result = await chkAccountOfCustomer(newValue);
                if(result != null){
                    errors.push(`Account already exists...`);
                }
            }else if(field == `REFERER_ID`){
                const result = await getUserByName({name:newValue});
                if(result == null || result[0].TYPE != 'Customer'){
                    errors.push(`Invalid referer...`);
                }
            }else if(field == `BROKER_ID`){
                const result = await getUserByName({name:newValue});
                if(result == null || result[0].TYPE != 'Broker'){
                    errors.push(`Invalid broker...`);
                }
            }

            switch(field){
                case 'ACCOUNT_NO':
                    sql = `
                    UPDATE CUSTOMER
                    SET ACCOUNT_NO = :newValue 
                    WHERE USER_ID = :userId
                    `;
                    break;
                default:
                    sql = `
                    UPDATE CUSTOMER
                    SET ${field} = (SELECT USER_ID FROM "USER" WHERE NAME = :newValue) 
                    WHERE USER_ID = :userId
                    `;
                    break;
            }
        }else if(fields.broker.includes(field)){
            if(field == `LICENSE_NO`){
                const result = await chkLicenseOfBroker(newValue);
                if(result != null){
                    errors.push(`License already in use`);
                }
            }
            sql = `
            UPDATE BROKER 
            SET ${field} = :newValue
            WHERE BROKER.USER_ID = :userId
            `;
        }else if(fields.corporation.includes(field)){
            if(field == `CORP_REG_NO`){
                const result  = await chkRegOfCorp(newValue);
                if(result != null){
                    errors.push(`Corporation already in use`);
                }
            }
            if(field == `SYMBOL`){
                const stock = await getAllStockDataBySymbol({symbol:newValue});
                console.log('stock: ', stock);
                if(stock != null){
                    errors.push(`Symbol already in use`);
                }
            }

            switch(field){
                case `SYMBOL`:
                    sql = `
                    UPDATE STOCK 
                    SET SYMBOL = :newValue
                    WHERE CORP_ID = :userId
                    `;
                    break;
                default:
                    sql = `
                    UPDATE CORPORATION 
                    SET ${field} = :newValue
                    WHERE CORP_ID = :userId  
                    `;
            }
        }else if(fields.admin.includes(field)){
            sql = `
            UPDATE ADMIN  
            SET ${field} = :newValue
            WHERE ADMIN_ID = :userId
            `;
        }

        const binds = {
            newValue: newValue,
            userId : userId 
        }
        //console.log(sql);

        if(errors.length == 0)await db.execute(sql,binds);
        else{
            console.log(errors);
            return null;
        };
        const newResultByName =  await getUserByID(userId);
        const profile = await getProfileByName(newResultByName.NAME); 
        console.log(profile);
        return profile;

    }catch(err){
        console.log(`Found ${err.message} while updating profile of ${payload.userId}...`);
        return null;
    }
}

const addContact = async (payload)=> {
    errors.length = 0;
    try{
        const userId = payload.userId;
        const user = await getUserByID(userId);
        const contact = payload.contact;

        if(user == null){
            errors.push(`User not found`);
            console.log(`User not found`);
            return null;
        }

        if(!validations.validateContact(contact)){
            errors.push(`Contact invalid`);
            console.log(`Contact invalid`);
            return null;
        }

        const resultByContact = await getUserByContact(contact);

        if(resultByContact != null){
            errors.push(`Contact already in use`);
            console.log(`Contact already in use`);
            return null;
        }

        const sql = `
        INSERT INTO USER_CONTACT(USER_ID, CONTACT)
        values (:user_id, :contact)
        `;

        const binds = {
            user_id: userId,
            contact: contact
        };

        await db.execute(sql, binds);

        const result = await getUserByContact(contact);
        return result;

    }catch(err){
        console.log(`Found ${err.message} while adding contact of ${payload.userId}...`);
        return null;
    }
};


const deleteAccount = async (payload) => {
    try{    
        errors.length = 0;
        const userId = payload.userId;
        const pwd = payload.password;

        const user = await getUserByID(userId);

        if(user === null){
            errors.push(`User ${payload.userId} does not exist`);
            return 0;
        }

        const pass = await chkCreds(user.NAME,pwd);

        if(pass !== 1337){
            console.error(`Incorrect password`);
            return 0;
        }

        const sql = `
        UPDATE "USER"
        SET IS_DELETED = 'T'
        WHERE USER_ID = :userId
        `;

        const binds = {
            userId: userId
        }

        await db.execute(sql,binds);

        return await getUserByID(userId);

    }catch(err){
        errors.push(`Found ${err.message} while deleting account of ${payload.userId}...`);
        return 0;
    }
}




const deleteContact = async (payload) => {
    errors.length = 0;
    try{
        const userId = payload.userId;
        const contact = payload.contact;
        const userById = await getUserByID(userId);
        const userByContact = await getUserByContact(contact);
        //let errors = [];

        if(userById == null){
            errors.push(`Invalid user`);
        }

        if(userByContact == null){
            errors.push(`Invalid contact`);
        }

        if(userId != userByContact.USER_ID){
            errors.push(`User-Contact mismatch`);
        }

        if(errors.length > 0){
            console.log(errors);
            return null;
        }

        const sql = `
        DELETE FROM USER_CONTACT
        WHERE USER_ID = :user_id AND CONTACT = :contact
        `;

        const binds = {
            user_id: userId,
            contact: contact
        };

        await db.execute(sql, binds);

        return await getUserByContact(contact);

    }catch(err){
        console.log(`Found ${err.message} while deleting contact of ${payload.userId}...`);
        return null;
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
    createCorp,
    getErrors,
    isPrem,
    getUserByID,
    getProfileByName,
    getContactByName,
    updateProfile,
    addContact,
    deleteContact,
    deleteAccount
};
