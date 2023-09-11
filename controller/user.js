const oracledb = require('oracledb');
const db = require('../config/database.js');
const validations = require('../util/validation');
const {getUserTypeByName,chkCreds} = require('./login')
const fields = require('../util/fields')
const {getAllStockDataBySymbol} = require('./stock')

let errors = [];

const getUserErrors = async () =>{
    return errors;
}

const getPwdHash = async (pwd) => {
    try{
        errors.length = 0;
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
    }catch(err){
        errors.push(err);
    }
}

const getUserByEmail = async (payload) => {
    errors.length = 0;
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
            errors.push(`Email ${email} does not exist`);
            return null;
        }
        return result.rows;
    }catch(err){
        errors.push(`Found error: ${err} while searching id ${email}`);
        return null;
    }
}

const getUserByName = async (payload) => {
    errors.length = 0;
    const name = payload.name;
    console.log(`Fetching ${name}...`);
    const sql = `
    SELECT 
        USER_ID,
        NAME,
        EMAIL,
        "TYPE",
        (STREET_NO||' '||STREET_NAME||', '||CITY||', '||COUNTRY) ADDRESS,
        ZIP
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
        errors.push(`Found error: ${err} while searching user ${name}`);
        return null;
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
            errors.push(`Contact ${contact} does not exist`);
            return null;
        }
        return result.rows[0];
    }catch(err){
        console.error(`Found error: ${err} while searching user ${contact}`);
        return null;
    }

}

const getUserById = async (idP) => {
    errors.length = 0;
    const id = idP;
    console.log(`Fetching ${idP}...`);
    const sql = `
    SELECT 
        USER_ID,
        NAME,
        EMAIL,
        "TYPE",
        (STREET_NO||' '||STREET_NAME||', '||CITY||', '||COUNTRY) ADDRESS,
        ZIP
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
        errors.push(`Found error: ${err} while searching user ${id}`);
        return null;
    }

}


const createUser = async (payload) => {
    try{
        errors.length = 0 ;
        console.log(`In create user ${payload}`);
        // necessary user table checks
        const resultByName  = await getUserByName(payload);
        const resultByEmail = await getUserByEmail(payload);

        errors.length = 0 ;

        if(resultByName != null){
            errors.push(`Username already in use...`);
        }

        if(resultByEmail != null){
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
            if(resultByContact != null){
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

    }catch(err){
        errors.push(`Found error: ${err} while creating user ${payload}`);
        return null;
    }   
}

const chkAccountOfCustomer = async (accountNo) => {
    errors.length = 0;
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
            errors.push(`Account No ${accountNo} does not exist`);
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
    errors.length = 0;
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
            const referer = await getUserByName({name:payload.refererName}) ;
            errors.length = 0;
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
            return;
        }
        errors.length = 0;
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
    }
}

async function createBroker (payload) {
    console.log(`Creating ${payload} broker `);
    try{
        errors.length = 0;
        if(await chkLicenseOfBroker(payload.licenseNo) != null ){ 
            errors.push(`License ${payload.licenseNo} already exists`);
            return;
        }
        errors.length = 0;

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
        errors.length = 0;
        if(await chkRegOfCorp(payload.corpRegNo) !== null){
            errors.push(`Reg no ${payload.corpRegNo} already exists`);
            return;
        }
        errors.length = 0;

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
        // console.log(`id: ${id}`);
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
        return `N`;
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
                (STREET_NO||' '||STREET_NAME||', '||CITY||', '||COUNTRY) ADDRESS,
                ZIP,
                (SELECT NAME FROM "USER" WHERE USER_ID = ADDER_ID) ADDER,
                EMPLOYEE_ID,
                FUNDS
            FROM "USER" JOIN ADMIN ON USER_ID = ADMIN_ID 
            WHERE NAME = :name 
            AND "USER".IS_DELETED = 'F'
            `;
            break;
        case 'Customer':
            sql = `
            SELECT
                U.USER_ID,
                U.NAME,
                U.EMAIL,
                U."TYPE",
                ( U.STREET_NO || ' ' || U.STREET_NAME || ', ' || U.CITY || ', ' || U.COUNTRY ) ADDRESS,
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
                AND "USER".IS_DELETED = 'F'
            `;
            break;
        case 'Broker':
            sql = `
            SELECT 
                USER_ID
                NAME,
                EMAIL,
                "TYPE",
                (STREET_NO||' '||STREET_NAME||', '||CITY||', '||COUNTRY) ADDRESS,
                ZIP,
                LICENSE_NO,
                COMMISSION_PCT,
                EXPERTISE,
                NVL((SELECT COUNT(*) FROM CUSTOMER WHERE BROKER_ID = USER_ID),0) NUM_OF_CUSTOMERS
            FROM "USER" NATURAL JOIN BROKER
            WHERE NAME = :name
            AND "USER".IS_DELETED = 'F'
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
                ( STREET_NO || ' ' || STREET_NAME || ', ' || CITY || ', ' || COUNTRY ) ADDRESS,
                ZIP,
                CORP_REG_NO,
                SECTOR 
            FROM
                "USER"
                JOIN CORPORATION ON ( CORP_ID = USER_ID )
                LEFT OUTER JOIN STOCK ON CORPORATION.CORP_ID = STOCK.CORP_ID
            WHERE
                NAME = :name
                AND "USER".IS_DELETED = 'F'
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
        if(result.rows.length === 0){
            errors.push(`No such user ${name} found`);
            return null;
        }
        // console.log(result.rows);
        return result.rows;
    }catch(err){
        errors.push(`Found error: ${err} while searching for user ${name}...`);
        return null;
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
            errors.push(`No user ${name} found with this contact`);
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
    try{
        errors.length = 0;
        const userId = payload.userId;
        const field = payload.field;
        const newValue = payload.newValue;

        let sql;

        if(newValue === null){
            errors.push(`New value cannot be null`);
        }

        const user = await getUserById(userId);

        if(fields.user.includes(field)){
            if(field == 'NAME'){
                const resultByName  = await getUserByName({name:newValue});
                errors.length = 0;
                if(resultByName != null){
                    errors.push("User name already exists...");
                }
            }
            else if(field == 'EMAIL'){
                const resultByEmail = await getUserByEmail({email:newValue});
                errors.length = 0;
                if(resultByEmail != null){
                    errors.push("Email already exists...");
                }
                else if(!validations.validateEmail(newValue)){
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
                errors.length = 0;
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
                errors.length = 0;
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
                errors.length = 0;
                if(result != null){
                    errors.push(`Corporation already in use`);
                }
            }
            if(field == `SYMBOL`){
                const stock = await getAllStockDataBySymbol({symbol:newValue});
                console.log('stock: ', stock);
                errors.length = 0;
                
                if(stock != null){
                    errors.push(`Symbol already in use`);
                }
            }
            if(field == `PRICE`){
                if(newValue <= 0){
                    errors.push(`Price must be positive`);
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
                case `PRICE`:
                    sql = `
                    UPDATE STOCK 
                    SET PRICE = :newValue
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

        if(errors.length == 0)await db.execute(sql,binds);
        else{
            console.log(errors);
            return null;
        };
        const newResultByName =  await getUserById(userId);
        const profile = await getProfileByName(newResultByName.NAME); 
        // console.log(profile);
        return profile;

    }catch(err){
        errors.push(`Found ${err.message} while updating profile of ${payload.userId}...`);
        return null;
    }
}

const addContact = async (payload)=> {
    try{
        errors.length = 0;
        const userId = payload.userId;
        const user = await getUserById(userId);
        const contact = payload.contact;

        if(user == null){
            errors.push(`User not found`);
            return null;
        }

        if(!validations.validateContact(contact)){
            errors.push(`Contact in valid`);
            return null;
        }

        const resultByContact = await getUserByContact(contact);

        if(resultByContact != null){
            errors.push(`Contact already in use`);
            return null;
        }

        errors.length = 0;

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
        errors.push(`Found ${err.message} while adding contact of ${payload.userId}...`);
        return null;
    }
};

const deleteContact = async (payload) => {
    try{
        errors.length = 0;
        const userId = payload.userId;
        const contact = payload.contact;
        const userById = await getUserById(userId);
        const userByContact = await getUserByContact(contact);
        

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

const deleteAccount = async (payload) => {
    try{    
        errors.length = 0;
        const userId = payload.userId;
        const pwd = payload.password;

        const user = await getUserById(userId);

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

        return await getUserById(userId);

    }catch(err){
        errors.push(`Found ${err.message} while deleting account of ${payload.userId}...`);
        return 0;
    }
}

const getOwnsInfoByUserId = async (userId) => {
    try{
        errors.length = 0;

        const user = await getUserById(userId);

        if(user === null){
            errors.push(`Not a registered user`);
            return null;
        }


        const sql = `
        SELECT 
            SYMBOL,
            QUANTITY
        FROM 
            OWNS 
        WHERE USER_ID = :user_id  
        ORDER BY QUANTITY DESC
        `;

        const bind = {
            user_id : userId
        };

        const owns = await db.execute(sql,bind);

        return owns.rows;

    }catch(err){
        errors.push(`Found ${err.message} while getting owns of ${payload.userId}...`);
        return null;
    }
}

module.exports = {
    getOwnsInfoByUserId,
    getPwdHash,
    getUserByEmail,
    getUserByName,
    getUserByContact,
    getUserById,
    createUser,
    createCustomer,
    createBroker,
    createCorp,
    isPrem,
    getProfileByName,
    getContactByName,
    updateProfile,
    addContact,
    deleteContact,
    deleteAccount,
    getUserErrors
};