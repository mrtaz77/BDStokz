# Triggers (Total )
## Tables 
| Table | # of Triggers |
|-------|---------------|
|[ACTIVITY](#activity)| 1 |
|[ADMIN](#admin)|1|
|[BACKUP STOCK](#backup_stock)|1|
|[BROKER](#broker)|2|
|[CORPORATION](#corporation)|2|
|[CUSTOMER](#customer)|4|
|[EMPLOYEE](#employee)|1|
|[ORDER](#order)|20|
|[OWNS](#owns)|1|
|[PARTICIPATION](#participation)|1|
|[PORTFOLIO](#portfolio)|1|
|[STOCK](#stock)|7|
|[USER](#user)|9|
|[USER_CONTACT](#user_contact)|1|
|TOTAL|52|



### Activity
1. delete_participation_of_upcoming_activity
    ```sql
    CREATE OR REPLACE TRIGGER delete_participation_of_upcoming_activity 
    AFTER DELETE 
    ON ACTIVITY
    FOR EACH ROW 
    BEGIN 
        DELETE FROM PARTICIPATION 
        WHERE ACTIVITY_ID = :OLD.ACTIVITY_ID;
    END;
    /
    ```

### Admin
1. admin_funds_update
    ```sql
    CREATE OR REPLACE TRIGGER admin_funds_update 
    AFTER UPDATE OF FUNDS 
    ON ADMIN 
    FOR EACH ROW 
    BEGIN 
    INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:NEW.ADMIN_ID,'FUNDS UPDATE','Your funds changed from '||:OLD.FUNDS||' -> '||:NEW.FUNDS);
    INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('FUNDS UPDATE',:NEW.ADMIN_ID||' : '||:OLD.FUNDS||' -> '||:NEW.FUNDS);
    END;
    /
    ```


### Backup_Stock
1. backup_log
    ```sql
    CREATE OR REPLACE TRIGGER backup_log 
    AFTER INSERT OR UPDATE OF AVAILABLE_LOTS 
    ON "BACKUP STOCK"
    FOR EACH ROW
    BEGIN 
    IF INSERTING THEN 
        INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('BACKUP STOCK PURCHASE',:NEW.AVAILABLE_LOTS||' lots of stock '||:new.SYMBOL||' purchased');
        ELSIF UPDATING('AVAILABLE_LOTS') THEN 
        INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('BACKUP STOCK UPDATE',:OLD.AVAILABLE_LOTS||' -> '||:new.AVAILABLE_LOTS||' for '||:new.SYMBOL);
    END IF;
    END;
    /
    ```

### Broker
1. broker_details_update_log
    ```sql
    CREATE OR REPLACE TRIGGER broker_details_update_log
    AFTER UPDATE OF LICENSE_NO,COMMISSION_PCT,EXPERTISE 
    ON BROKER
    FOR EACH ROW 
    BEGIN 
        IF UPDATING('LICENSE_NO') THEN 
            INSERT INTO user_log (user_id, event_type, description) 
            VALUES (:NEW.user_id,'UPDATE LICENSE_NO','Your license_no has been changed to '||:NEW.LICENSE_NO || ' successfully');
            INSERT INTO admin_log (event_type, DESCRIPTION) 
            VALUES ('UPDATE LICENSE_NO','License_no of '||:NEW.USER_ID || ' changed from '||:OLD.LICENSE_NO||' to '||:NEW.LICENSE_NO); 
        END IF;
        IF UPDATING('COMMISSION_PCT') THEN 
            INSERT INTO user_log (user_id, event_type, description) 
            VALUES (:NEW.user_id,'UPDATE COMMISSION_PCT','Your commission_pct changed from '||:old.COMMISSION_PCT||' to '||:new.COMMISSION_PCT);
            INSERT INTO admin_log (event_type, DESCRIPTION) 
            VALUES ('UPDATE COMMISSION_PCT','Commission_pct of '||:NEW.USER_ID || ' changed from '||:old.COMMISSION_PCT||' to '||:new.COMMISSION_PCT);
        END IF;
        IF UPDATING('EXPERTISE') THEN 
                INSERT INTO user_log (user_id, event_type, description) 
            VALUES (:NEW.user_id,'EXPERTISE UPDATE','Your expertise has been changed successfully');
                INSERT INTO admin_log (event_type, DESCRIPTION) 
            VALUES ('EXPERTISE UPDATE',:NEW.USER_ID||' has been changed expertise to '||:new.EXPERTISE);
        END IF;
    END;
    /
    ```

2. set_null_broker_id
    ```sql
    CREATE OR REPLACE TRIGGER 
    set_null_broker_id
    AFTER UPDATE OF IS_DELETED 
    ON BROKER
    FOR EACH ROW
    BEGIN
        IF :NEW.IS_DELETED = 'T' THEN 
            UPDATE CUSTOMER
            SET BROKER_ID = null 
            WHERE BROKER_ID = :NEW.USER_ID;
        END IF;
    END;
    /
    ```

### Corporation 
1. delete_upcoming_activity_on_deleting_corp
    ```sql
    CREATE OR REPLACE TRIGGER delete_upcoming_activity_on_deleting_corp
    AFTER UPDATE OF IS_DELETED 
    ON CORPORATION
    FOR EACH ROW 
    BEGIN 
        IF :NEW.IS_DELETED = 'T' THEN 
            DELETE FROM ACTIVITY
            WHERE CORP_ID = :NEW.CORP_ID AND START_TIME >= CURRENT_TIMESTAMP;
        END IF;
    END;
    / 
    ```

2. block_stock_on_deleting_corp
    ```sql
    CREATE OR REPLACE TRIGGER block_stock_on_deleting_corp 
    AFTER UPDATE OF IS_DELETED 
    ON CORPORATION
    FOR EACH ROW 
    BEGIN 
        IF :NEW.IS_DELETED = 'T' THEN 
                UPDATE STOCK 
                SET BLOCKED = 'T'
                WHERE CORP_ID = :NEW.CORP_ID;
        END IF;
    END;
    /
    ```



### Customer
1. customer_details_update_log
    ```sql
    CREATE OR REPLACE TRIGGER customer_details_update_log
    AFTER UPDATE OF ACCOUNT_NO,BROKER_ID,REFER_COUNT 
    ON CUSTOMER
    FOR EACH ROW 
    BEGIN 
        IF UPDATING('ACCOUNT_NO') THEN 
            INSERT INTO user_log (user_id, event_type, description) 
            VALUES (:NEW.user_id,'UPDATE ACCOUNT_NO','Your account_no has been changed to '||:NEW.ACCOUNT_NO || ' successfully');
            INSERT INTO admin_log (event_type, DESCRIPTION) 
            VALUES ('UPDATE ACCOUNT_NO','Account_no of '||:NEW.USER_ID || ' changed from '||:OLD.ACCOUNT_NO||' to '||:NEW.ACCOUNT_NO); 
        END IF;
        IF UPDATING('REFER_COUNT') THEN 
            INSERT INTO user_log (user_id, event_type, description) 
            VALUES (:NEW.user_id,'UPDATE REFER_COUNT','Thank you for refering our site to another customer');
            INSERT INTO admin_log (event_type, DESCRIPTION) 
            VALUES ('UPDATE REFER_COUNT','REFER_COUNT of '||:NEW.USER_ID || ' changed from '||:OLD.REFER_COUNT||' to '||:NEW.REFER_COUNT);
            IF :OLD.REFER_COUNT = 3 AND :NEW.REFER_COUNT = 4 THEN 
                    INSERT INTO user_log (user_id, event_type, description) 
                    VALUES (:NEW.user_id,'PREMIUM','Congrats ! You are now a premium user');
            END IF;
        END IF;
        IF UPDATING('BROKER_ID') THEN 
                INSERT INTO user_log (user_id, event_type, description) 
            VALUES (:NEW.user_id,'BROKER UPDATE','Your broker has been changed successfully');
                INSERT INTO admin_log (event_type, DESCRIPTION) 
            VALUES ('BROKER UPDATE',:NEW.USER_ID||' has been changed broker to '||:new.BROKER_ID);
        END IF;
    END;
    /
    ```

2. referCountUpdate 
    ```sql
    CREATE OR REPLACE TRIGGER referCountUpdate 
    BEFORE INSERT 
    ON CUSTOMER
    FOR EACH ROW 
    DECLARE
    BEGIN
        UPDATE CUSTOMER
        SET REFER_COUNT = REFER_COUNT + 1
        WHERE USER_ID = :NEW.REFERER_ID;
    END;
    /
    ```

3. delete_portfolio_on_deleting_customer 
    ```sql
    CREATE OR REPLACE TRIGGER delete_portfolio_on_deleting_customer 
    AFTER UPDATE OF IS_DELETED 
    ON CUSTOMER
    FOR EACH ROW
    BEGIN 
        IF :NEW.IS_DELETED = 'T' THEN 
            DELETE FROM PORTFOLIO 
            WHERE USER_ID = :NEW.USER_ID;
        END IF;
    END;
    /
    ```

4. set_null_referer_id
    ```sql
    CREATE OR REPLACE TRIGGER 
    set_null_referer_id
    AFTER UPDATE OF IS_DELETED 
    ON CUSTOMER
    FOR EACH ROW
    BEGIN
        IF :NEW.IS_DELETED = 'T' THEN 
            UPDATE CUSTOMER
            SET REFERER_ID = null 
            WHERE REFERER_ID = :NEW.USER_ID;
        END IF;
    END;
    /
    ```

### Employee
1. delete_emp_contact
    ```sql
    CREATE OR REPLACE TRIGGER delete_emp_contact
    AFTER UPDATE OF IS_DELETED 
    ON EMPLOYEE
    FOR EACH ROW
    DECLARE
    COUNT_CONTACT NUMBER;
    BEGIN
        IF :NEW.IS_DELETED = 'T' THEN  
            SELECT COUNT(*) INTO COUNT_CONTACT FROM EMP_CONTACT WHERE EMPLOYEE_ID = :NEW.EMPLOYEE_ID;
            IF COUNT_CONTACT > 0 THEN 
                DELETE FROM EMP_CONTACT WHERE EMPLOYEE_ID = :NEW.EMPLOYEE_ID; 
            END IF;
        END IF;
    END;
    / 
    ```

### Order
1. order_placement_log
    ```sql
    CREATE OR REPLACE TRIGGER order_placement_log
    AFTER INSERT ON "ORDER"
    FOR EACH ROW
    DECLARE
    CORPID NUMBER(10);
    NAME VARCHAR2(20);
    BEGIN 
        SELECT CORP_ID INTO CORPID FROM STOCK WHERE SYMBOL = :NEW.SYMBOL;
        SELECT NAME INTO NAME FROM "USER" WHERE USER_ID = :NEW.USER_ID;
        IF :NEW."TYPE" = 'BUY' THEN 
        INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:NEW.USER_ID,'BUY','Your buy order has been placed successfully');
        
        INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (CORPID,'BUY',NAME||' placed a buy order for your stock;amount '||:new.LATEST_QUANTITY||' and price '||:new.LATEST_PRICE);
        
        
        INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('BUY',:new.USER_ID||' placed a buy order for '||:new.SYMBOL||';amount '||:new.LATEST_QUANTITY||' and price '||:new.LATEST_PRICE);

        ELSIF :NEW."TYPE" = 'SELL' THEN 
        INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:NEW.USER_ID,'SELL','Your sell order has been placed successfully');	
        
        INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('SELL',:new.USER_ID||' placed a sell order for '||:new.SYMBOL||';amount '||:new.LATEST_QUANTITY||' and price '||:new.LATEST_PRICE);
        END IF;
    END;
    /
    ```

2. order_status_log 
    ```sql
    CREATE OR REPLACE TRIGGER order_status_log 
    AFTER UPDATE OF STATUS 
    ON "ORDER"
    FOR EACH ROW 
    DECLARE
    CORPID NUMBER(10);
    NAME VARCHAR2(20);
    BEGIN 
        SELECT CORP_ID INTO CORPID FROM STOCK WHERE SYMBOL = :NEW.SYMBOL;
        SELECT NAME INTO NAME FROM "USER" WHERE USER_ID = :NEW.USER_ID; 
        IF :NEW."TYPE" = 'BUY' THEN 
            INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:NEW.USER_ID,'BUY STATUS','Your buy order '||:new.ORDER_ID||' is a '||:new.STATUS);
        
        INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (CORPID,'BUY STATUS','The buy order '||:new.ORDER_ID||' placed by '||NAME||' is a '||:new.STATUS);
        
        
        INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('BUY STATUS','Buy order '||:new.ORDER_ID||' of '||:NEW.USER_ID||' is a '||:new.STATUS);
        ELSIF :new."TYPE" = 'SELL' THEN 
        INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:NEW.USER_ID,'SELL STATUS','Your sell order '||:new.ORDER_ID||' is a '||:new.STATUS);
        
        INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('SELL STATUS','Sell order '||:new.ORDER_ID||' of '||:NEW.USER_ID||' is a '||:new.STATUS);
        END IF;
    END;
    /
    ```

3. order_details_log 
    ```sql
    CREATE OR REPLACE TRIGGER order_details_log 
    AFTER UPDATE OF LATEST_QUANTITY,LATEST_PRICE 
    ON "ORDER"
    FOR EACH ROW
    BEGIN 
    IF UPDATING('LATEST_QUANTITY') THEN 
        INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:NEW.USER_ID,'UPDATE QUANTITY OF ORDER','Your changed latest quantity from '||:OLD.LATEST_QUANTITY||' to '||:new.LATEST_QUANTITY||' of order '||:new.ORDER_ID);
        
        INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('UPDATE QUANTITY OF ORDER',:new.user_id||' changed latest quantity from '||:OLD.LATEST_QUANTITY||' to '||:new.LATEST_QUANTITY||' of order '||:new.ORDER_ID);

    END IF;
    IF UPDATING('LATEST_PRICE') THEN 
    INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:NEW.USER_ID,'UPDATE PRICE OF ORDER','Your changed latest price from '||:OLD.LATEST_PRICE||' to '||:new.LATEST_PRICE||' of order '||:new.ORDER_ID);
        
        INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('UPDATE PRICE OF ORDER',:new.user_id||' changed latest price from '||:OLD.LATEST_PRICE||' to '||:new.LATEST_PRICE||' of order '||:new.ORDER_ID);
    END IF;
    END;
    /
    ```


4. place_order_user_check
    ```sql
    CREATE OR REPLACE TRIGGER place_order_user_check
    BEFORE INSERT
    ON "ORDER"
    FOR EACH ROW 
    DECLARE 
    TYP VARCHAR2(20);
    NUM NUMBER;
    BEGIN
        SELECT COUNT(*) INTO NUM FROM 
        (SELECT "TYPE" FROM "USER" WHERE USER_ID = :NEW.USER_ID);
        IF NUM = 0 THEN 
            RAISE_APPLICATION_ERROR(-20000,'User Not Found');
        ELSE 
            SELECT "TYPE" INTO TYP FROM "USER" WHERE USER_ID = :NEW.USER_ID;
            IF TYP NOT IN ('Admin','Customer') THEN 
                RAISE_APPLICATION_ERROR(-20001,'User not permitted');
            END IF;
        END IF;
    END;
    /
    ```

5. place_order_symbol_check
    ```sql
    CREATE OR REPLACE TRIGGER place_order_symbol_check
    BEFORE INSERT
    ON "ORDER"
    FOR EACH ROW 
    DECLARE 
    COUNT_SYM NUMBER;
    BEGIN
        SELECT COUNT(*) INTO COUNT_SYM FROM 
        (SELECT SYMBOL FROM STOCK WHERE SYMBOL = :NEW.SYMBOL AND BLOCKED = 'F');  
        IF COUNT_SYM = 0 THEN  
            RAISE_APPLICATION_ERROR(-20002,'Invalid stock');
        END IF;
    END;
    /
    ```

6. buy_order_amount_check 
    ```sql
    CREATE OR REPLACE TRIGGER buy_order_amount_check 
    BEFORE INSERT OR UPDATE OF LATEST_QUANTITY
    ON "ORDER"
    FOR EACH ROW 
    DECLARE 
    NUM_SHARES NUMBER;
    ALLOWED_SHARES NUMBER;
    BEGIN
        IF :NEW."TYPE" = 'BUY' THEN
            SELECT LOT INTO NUM_SHARES FROM STOCK WHERE SYMBOL = :NEW.SYMBOL;
            SELECT LOT*AVAILABLE_LOTS INTO ALLOWED_SHARES FROM STOCK WHERE SYMBOL = :NEW.SYMBOL;
            IF :NEW.LATEST_QUANTITY*NUM_SHARES > ALLOWED_SHARES OR :NEW.LATEST_QUANTITY*NUM_SHARES <= 0 THEN 
                RAISE_APPLICATION_ERROR(-20003,'Invalid amount of stock');
            END IF;
                :NEW.LATEST_QUANTITY := :NEW.LATEST_QUANTITY*NUM_SHARES;
        END IF;
    END;
    /
    ```

7. sell_order_amount_check
    ```sql
    CREATE OR REPLACE TRIGGER sell_order_amount_check 
    BEFORE INSERT OR UPDATE OF LATEST_QUANTITY
    ON "ORDER"
    FOR EACH ROW 
    DECLARE 
    TYP VARCHAR2(20);
    FLAG NUMBER;
    NUM_SHARES NUMBER;
    AVAILABLE_SHARE_LOTS NUMBER;
    AVAILABLE_SHARES NUMBER;
    BEGIN
        SELECT LOT INTO NUM_SHARES FROM STOCK WHERE SYMBOL = :NEW.SYMBOL;
        IF :NEW."TYPE" = 'SELL' THEN
            SELECT "TYPE" INTO TYP FROM "USER" WHERE USER_ID = :NEW.USER_ID;
            IF TYP = 'Admin' THEN
                SELECT COUNT(SYMBOL) INTO FLAG 
                FROM "BACKUP STOCK"
                WHERE SYMBOL = :NEW.SYMBOL;

                IF FLAG = 0 THEN 
                    RAISE_APPLICATION_ERROR(-20003,'Invalid amount of stock');
                ELSE 
                    SELECT AVAILABLE_LOTS INTO AVAILABLE_SHARE_LOTS 
                    FROM "BACKUP STOCK"
                    WHERE SYMBOL = :NEW.SYMBOL;
                    IF :NEW.LATEST_QUANTITY > AVAILABLE_SHARE_LOTS OR :NEW.LATEST_QUANTITY*NUM_SHARES <= 0 THEN 
                        RAISE_APPLICATION_ERROR(-20003,'Invalid amount of stock');
                    END IF;
                END IF;
            ELSIF TYP = 'Customer' THEN
                SELECT COUNT(*) INTO FLAG 
                FROM OWNS 
                WHERE 
                USER_ID = :NEW.USER_ID AND 
                SYMBOL = :NEW.SYMBOL;

                IF FLAG = 0 THEN 
                    RAISE_APPLICATION_ERROR(-20003,'Invalid amount of stock');
                END IF;

                SELECT 
                    QUANTITY INTO AVAILABLE_SHARES 
                FROM OWNS 
                WHERE 
                    USER_ID = :NEW.USER_ID AND 
                    SYMBOL = :NEW.SYMBOL;
                IF :NEW.LATEST_QUANTITY * NUM_SHARES > AVAILABLE_SHARES  OR :NEW.LATEST_QUANTITY*NUM_SHARES <= 0 THEN 
                    RAISE_APPLICATION_ERROR(-20003,'Invalid amount of stock');
                END IF;
            ELSE 
                RAISE_APPLICATION_ERROR(-20001,'User not permitted');
            END IF;
            :NEW.LATEST_QUANTITY := :NEW.LATEST_QUANTITY*NUM_SHARES;
        END IF;
    END;
    /
    ```

8. latest_update_time_set
    ```sql
    CREATE OR REPLACE TRIGGER latest_update_time_set
    BEFORE INSERT OR UPDATE
    ON "ORDER"
    FOR EACH ROW 
    BEGIN
        :NEW.LATEST_UPDATE_TIME := CURRENT_TIMESTAMP;
    END;
    /
    ```

9. transaction_fee_set 
    ```sql
    CREATE OR REPLACE TRIGGER transaction_fee_set 
    BEFORE INSERT OR UPDATE
    ON "ORDER"
    FOR EACH ROW
    DECLARE 
    TYP VARCHAR2(20);
    BEGIN
        IF :NEW.STATUS = 'FAILURE' THEN
            :NEW.TRANSACTION_FEE := 0;
        ELSE 
            SELECT "TYPE" INTO TYP FROM "USER" WHERE USER_ID = :NEW.USER_ID;
            IF TYP = 'Admin' THEN 
                :NEW.TRANSACTION_FEE := 0;
            ELSIF TYP = 'Customer' THEN  
                :NEW.TRANSACTION_FEE := ROUND(:NEW.LATEST_PRICE * :NEW.LATEST_QUANTITY * 2 / 100,2);
            END IF;
        END IF;
    END; 
    /
    ```

10. transaction_time_set
    ```sql
    CREATE OR REPLACE TRIGGER transaction_time_set
    BEFORE UPDATE
    ON "ORDER"
    FOR EACH ROW
    BEGIN
        IF :NEW.STATUS IN ('SUCCESS') THEN 
            :NEW.TRANSACTION_TIME := CURRENT_TIMESTAMP;
        ELSE 
            :NEW.TRANSACTION_TIME := NULL;
        END IF;
    END;
    /
    ```

11. sell_order_status_check
    ```sql
    CREATE OR REPLACE TRIGGER sell_order_status_check 
    BEFORE UPDATE 
    ON "ORDER"
    FOR EACH ROW
    BEGIN
        IF :NEW.STATUS = 'FAILURE' AND :NEW."TYPE" = 'SELL' THEN 
            RAISE_APPLICATION_ERROR(-20004,'Sell order can never fail');
        END IF;
    END;
    /
    ```


12. buy_order_success_admin_funds_check
    ```sql
    CREATE OR REPLACE TRIGGER buy_order_success_admin_funds_check 
    BEFORE UPDATE OF "STATUS"
    ON "ORDER"
    FOR EACH ROW 
    DECLARE 
    TYP VARCHAR2(20);
    FUND NUMBER(20,2);
    FLAG NUMBER;
    BEGIN 
        IF :NEW.STATUS = 'SUCCESS' THEN 
            SELECT "TYPE" INTO TYP FROM "USER" WHERE USER_ID = :NEW.USER_ID;
            IF TYP = 'Admin' THEN 
                SELECT COUNT(FUNDS) INTO FLAG 
                FROM ADMIN WHERE ADMIN_ID = :NEW.USER_ID;

                IF FLAG = 0 THEN 
                    :NEW.STATUS := 'FAILURE'; 
                ELSE 
                    SELECT FUNDS INTO FUND FROM ADMIN WHERE ADMIN_ID = :NEW.USER_ID;
                    IF FUND < :NEW.LATEST_PRICE * :NEW.LATEST_QUANTITY THEN 
                        :NEW.STATUS := 'FAILURE'; 
                    END IF;
                END IF;
            END IF;
        END IF;
    END;
    /
    ```

13. buy_order_success_update_owns_or_backup_stock
    ```sql
    CREATE OR REPLACE TRIGGER buy_order_success_update_owns_or_backup_stock
    AFTER UPDATE OF STATUS
    ON "ORDER"
    FOR EACH ROW
    DECLARE 
    TYP VARCHAR2(20);
    COUNT_SYM NUMBER;
    FLAG NUMBER;
    BEGIN 
        IF :NEW.STATUS = 'SUCCESS' AND :NEW."TYPE" = 'BUY' THEN 
            SELECT "TYPE" INTO TYP FROM "USER" WHERE USER_ID = :NEW.USER_ID;
            IF TYP = 'Admin' THEN
                SELECT COUNT(SYMBOL) INTO COUNT_SYM 
                FROM "BACKUP STOCK"
                WHERE SYMBOL = :NEW.SYMBOL;
                IF COUNT_SYM = 0 THEN
                    INSERT INTO "BACKUP STOCK" VALUES (:NEW.SYMBOL,:NEW.LATEST_QUANTITY/(SELECT LOT FROM STOCK WHERE SYMBOL = :NEW.SYMBOL),'F');
                ELSE 
                    UPDATE "BACKUP STOCK" 
                    SET AVAILABLE_LOTS = AVAILABLE_LOTS + :NEW.LATEST_QUANTITY/(SELECT LOT FROM STOCK WHERE SYMBOL = :NEW.SYMBOL)
                    WHERE SYMBOL = :NEW.SYMBOL;
                END IF;
            ELSIF TYP = 'Customer' THEN 
                SELECT COUNT(*) INTO FLAG FROM OWNS WHERE SYMBOL = :NEW.SYMBOL AND USER_ID = :NEW.USER_ID;
                            
                IF FLAG = 0 THEN 
                    INSERT INTO OWNS VALUES(:NEW.USER_ID,:NEW.SYMBOL,:NEW.LATEST_QUANTITY);
                ELSE 
                    UPDATE OWNS
                    SET QUANTITY = QUANTITY + :NEW.LATEST_QUANTITY
                    WHERE USER_ID = :NEW.USER_ID AND SYMBOL = :NEW.SYMBOL;
                END IF;
            END IF;
            END IF;
    END;
    /
    ```

14. buy_order_success_update_available_lots_from_stock
    ```sql
    CREATE OR REPLACE TRIGGER buy_order_success_update_available_lots_from_stock
    AFTER UPDATE OF STATUS
    ON "ORDER"
    FOR EACH ROW
    BEGIN
        IF :NEW.STATUS = 'SUCCESS' AND :NEW."TYPE" = 'BUY' THEN 
            UPDATE STOCK
            SET AVAILABLE_LOTS = AVAILABLE_LOTS - :NEW.LATEST_QUANTITY/(SELECT LOT FROM STOCK WHERE SYMBOL = :NEW.SYMBOL)
            WHERE SYMBOL = :NEW.SYMBOL;
        END IF;
    END;
    /
    ```

15. buy_order_success_update_customer_portfolio 
    ```sql
    CREATE OR REPLACE TRIGGER buy_order_success_update_customer_portfolio 
    AFTER UPDATE OF STATUS
    ON "ORDER"
    FOR EACH ROW
    DECLARE 
    FLAG NUMBER;
    USID NUMBER;
    USER_TYPE VARCHAR2(30);
    BEGIN
        SELECT "TYPE" INTO USER_TYPE FROM "USER" WHERE USER_ID = :NEW.USER_ID;
        IF :NEW.STATUS = 'SUCCESS' AND :NEW."TYPE" = 'BUY' AND USER_TYPE = 'Customer' THEN 
                    SELECT COUNT(*) INTO FLAG 
            FROM PORTFOLIO WHERE SECTOR = SECTOR_OF_STOCK(:NEW.SYMBOL) AND USER_ID = :NEW.USER_ID;
            
            IF FLAG = 0 THEN
                INSERT INTO PORTFOLIO VALUES (:NEW.USER_ID,SECTOR_OF_STOCK(:NEW.SYMBOL),:NEW.LATEST_PRICE*:NEW.LATEST_QUANTITY,0);
            ELSE 
                UPDATE PORTFOLIO
                SET BUY_AMOUNT = BUY_AMOUNT + :NEW.LATEST_PRICE*:NEW.LATEST_QUANTITY
                WHERE USER_ID = :NEW.USER_ID AND SECTOR = SECTOR_OF_STOCK(:NEW.SYMBOL);
            END IF;
        END IF;
    END;
    /
    ```

16. sell_order_success_update_owns_or_backup_stock
    ```sql
    CREATE OR REPLACE TRIGGER sell_order_success_update_owns_or_backup_stock
    AFTER UPDATE OF STATUS
    ON "ORDER"
    FOR EACH ROW
    DECLARE 
    TYP VARCHAR2(20);
    SYM VARCHAR2(40);
    USID NUMBER;
    BEGIN 
        IF :NEW.STATUS = 'SUCCESS' AND :NEW."TYPE" = 'SELL' THEN 
            SELECT "TYPE" INTO TYP FROM "USER" WHERE USER_ID = :NEW.USER_ID;
            IF TYP = 'Admin' THEN
                UPDATE "BACKUP STOCK" 
                SET AVAILABLE_LOTS = AVAILABLE_LOTS - :NEW.LATEST_QUANTITY/(SELECT LOT FROM STOCK WHERE SYMBOL = :NEW.SYMBOL)
                WHERE SYMBOL = :NEW.SYMBOL;
            ELSIF TYP = 'Customer' THEN 
                UPDATE OWNS
                SET QUANTITY = QUANTITY - :NEW.LATEST_QUANTITY
                WHERE USER_ID = :NEW.USER_ID AND SYMBOL = :NEW.SYMBOL;
            END IF;
        END IF;
    END;
    /
    ```


17. order_success_update_stock_ltp 
    ```sql
    CREATE OR REPLACE TRIGGER order_success_update_stock_ltp 
    AFTER UPDATE OF STATUS
    ON "ORDER"
    FOR EACH ROW
    BEGIN
        IF :NEW.STATUS = 'SUCCESS' THEN
            UPDATE STOCK 
            SET LTP = :NEW.LATEST_PRICE
            WHERE SYMBOL = :NEW.SYMBOL;
        END IF;
    END;
    /
    ```

18. sell_order_success_update_customer_portfolio 
    ```sql
    CREATE OR REPLACE TRIGGER sell_order_success_update_customer_portfolio 
    AFTER UPDATE OF STATUS
    ON "ORDER"
    FOR EACH ROW
    DECLARE 
    FLAG NUMBER;
    USID NUMBER;
    USER_TYPE VARCHAR2(30);
    BEGIN 
        SELECT "TYPE" INTO USER_TYPE FROM "USER" WHERE USER_ID = :NEW.USER_ID;
        IF :NEW.STATUS = 'SUCCESS' AND :NEW."TYPE" = 'SELL' AND USER_TYPE = 'Customer' THEN 
                    SELECT COUNT(*) INTO FLAG 
            FROM PORTFOLIO WHERE SECTOR = SECTOR_OF_STOCK(:NEW.SYMBOL) AND USER_ID = :NEW.USER_ID;
            
            IF FLAG = 0 THEN
                INSERT INTO PORTFOLIO VALUES (:NEW.USER_ID,SECTOR_OF_STOCK(:NEW.SYMBOL),0,:NEW.LATEST_PRICE*:NEW.LATEST_QUANTITY);
            ELSE 
                UPDATE PORTFOLIO
                SET SELL_AMOUNT = SELL_AMOUNT + :NEW.LATEST_PRICE*:NEW.LATEST_QUANTITY
                WHERE USER_ID = :NEW.USER_ID AND SECTOR = SECTOR_OF_STOCK(:NEW.SYMBOL);
            END IF;
        END IF;
    END;
    /
    ```

19. update_broker_commission_pct
    ```sql
    CREATE OR REPLACE TRIGGER update_broker_commission_pct
    AFTER UPDATE OF STATUS
    ON "ORDER"
    FOR EACH ROW 
    DECLARE 
    NEW_COM_PCT NUMBER(5,2);
    OLD_COM_PCT NUMBER(5,2);
    BID NUMBER;
    USER_TYPE VARCHAR2(30);
    BEGIN 
        SELECT "TYPE" INTO USER_TYPE FROM "USER" WHERE USER_ID = :NEW.USER_ID;
        IF :NEW.STATUS = 'SUCCESS' AND USER_TYPE = 'Customer' THEN
            SELECT COUNT(BROKER_ID) INTO BID FROM CUSTOMER WHERE USER_ID = :NEW.USER_ID;
            IF BID <> 0 THEN
                SELECT BROKER_ID INTO BID FROM CUSTOMER WHERE USER_ID = :NEW.USER_ID;
                NEW_COM_PCT := BROKER_COMMISSION_PCT(BID);
                SELECT NVL(COMMISSION_PCT,0) INTO OLD_COM_PCT FROM BROKER WHERE USER_ID = BID;
                IF OLD_COM_PCT < NEW_COM_PCT THEN
                    UPDATE BROKER 
                    SET COMMISSION_PCT = NEW_COM_PCT
                    WHERE USER_ID = BID;
                END IF;
            END IF;
        END IF;
    END;
    /
    ```

20. buy_order_admin_funds_check
    ```sql
    CREATE OR REPLACE TRIGGER buy_order_admin_funds_check
    BEFORE INSERT OR UPDATE OF LATEST_QUANTITY,LATEST_PRICE
    ON "ORDER"
    FOR EACH ROW 
    DECLARE 
    TYP VARCHAR2(30);
    FUND NUMBER(10,2);
    BEGIN
        FUND := 0;
        SELECT "TYPE" INTO TYP FROM "USER" WHERE USER_ID = :NEW.USER_ID;
        IF TYP = 'Admin' THEN 
            SELECT FUNDS INTO FUND FROM ADMIN WHERE ADMIN_ID = :NEW.USER_ID;
            IF :NEW.LATEST_PRICE * :NEW.LATEST_QUANTITY > FUND THEN 
                RAISE_APPLICATION_ERROR(-20006,'Insufficient funds for transaction');
            END IF;
        END IF;
    END;
    /
    ```


### Owns
1. ows_log
    ```sql
    CREATE OR REPLACE TRIGGER owns_log 
    AFTER INSERT OR UPDATE OF QUANTITY
    ON OWNS 
    FOR EACH ROW
    BEGIN 
        IF INSERTING THEN
            INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:new.USER_ID,'NEW OWNERSHIP','You now own '||:new.QUANTITY||' of '||:new.SYMBOL);
            INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('NEW OWNERSHIP',:new.user_id||' now owns '||:new.QUANTITY||' of '||:new.SYMBOL);
        ELSIF UPDATING('QUANTITY') THEN 
            INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:new.USER_ID,'UPDATE OWNERSHIP','Your owns of '||:new.SYMBOL||' changed from '||:old.QUANTITY||' to '||:new.QUANTITY);
            INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('UPDATE OWNERSHIP',:new.user_id||' owns of '||:new.SYMBOL||' changed from '||:old.QUANTITY||' to '||:new.QUANTITY);
        END IF;
    END;
    /  
    ```

### Participation
1. participation_log
    ```sql
    CREATE OR REPLACE TRIGGER PARTICIPATION_LOG 
    AFTER INSERT 
    ON PARTICIPATION
    FOR EACH ROW
    DECLARE
    EVENT_DATE VARCHAR2(30);
    "START TIME" VARCHAR2(30);
    CORPID NUMBER(10);
    NAME VARCHAR2(20);
    BEGIN 
        SELECT TO_CHAR( "DATE", 'DD Month YYYY' ) INTO EVENT_DATE FROM ACTIVITY WHERE ACTIVITY_ID = :NEW.ACTIVITY_ID;
        SELECT TIME_FORMAT ( START_TIME ) INTO "START TIME" FROM ACTIVITY WHERE ACTIVITY_ID = :NEW.ACTIVITY_ID;
        SELECT CORP_ID INTO CORPID FROM ACTIVITY WHERE ACTIVITY_ID = :NEW.ACTIVITY_ID;
        SELECT NAME INTO NAME FROM "USER" WHERE USER_ID = :NEW.USER_ID; 
        
        INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:NEW.USER_ID,'PARTICIPATING','Registration confirmed . Event on '||EVENT_DATE||' at '||"START TIME");
        
        INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (CORPID,'NEW PARTICIPATION',NAME||' is participating in your event on '||EVENT_DATE);
        
        
        INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('NEW PARTICIPATION',:new.USER_ID||' is participating in '||:new.ACTIVITY_ID);
    END;
    /
    ```

### Portfolio
1. portfolio_log 
    ```sql
    CREATE OR REPLACE TRIGGER portfolio_log 
    AFTER INSERT OR UPDATE OF BUY_AMOUNT,SELL_AMOUNT
    ON PORTFOLIO
    FOR EACH ROW 
    BEGIN
        IF INSERTING THEN 
            INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:NEW.USER_ID,'NEW PORTFOLIO','You have bought '||:new.BUY_AMOUNT||' and sold '||:new.SELL_AMOUNT||' in '||:new.SECTOR);
        INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('NEW PORTFOLIO',:new.USER_ID||' has bought '||:new.BUY_AMOUNT||' and sold '||:new.SELL_AMOUNT||' in '||:new.SECTOR);
        ELSIF UPDATING('BUY_AMOUNT') THEN
        INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:NEW.USER_ID,'UPDATE BUY AMOUNT','You now have bought '||:new.BUY_AMOUNT||' in '||:new.SECTOR);
        INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('UPDATE BUY AMOUNT','Buy amount of '||:new.USER_ID||' has changed from '||:old.BUY_AMOUNT||' to '||:new.BUY_AMOUNT||' in '||:new.SECTOR);
        ELSIF UPDATING('SELL_AMOUNT') THEN 
        INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:NEW.USER_ID,'UPDATE SELL AMOUNT','You now have sold '||:new.SELL_AMOUNT||' in '||:new.SECTOR);
        INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('UPDATE SELL AMOUNT','Sell amount of '||:new.USER_ID||' has changed from '||:old.sell_AMOUNT||' to '||:new.sell_AMOUNT||' in '||:new.SECTOR);
        END IF;
    END;
    /   
    ```

### Stock
1. stock_reg 
    ```sql
    CREATE OR REPLACE TRIGGER stock_reg 
    AFTER INSERT 
    ON STOCK
    FOR EACH ROW 
    BEGIN 
        INSERT INTO user_log (user_id, event_type, description) 
            VALUES (:NEW.CORP_ID,'NEW STOCK','Your stock '||:new.symbol||' has been registered successfully');
                INSERT INTO admin_log (event_type, DESCRIPTION) 
            VALUES ('NEW STOCK',:NEW.CORP_ID||' has registered their stock '||:new.SYMBOL);
    END;
    /
    ```

2. stock_log_trigger
    ```sql
    CREATE OR REPLACE TRIGGER stock_log_trigger
    AFTER INSERT OR UPDATE OF symbol, price, value, available_lots, ltp, blocked
    ON stock
    FOR EACH ROW
    DECLARE
        old_symbol VARCHAR2(255);
        old_price NUMBER;
        old_value NUMBER;
        old_available_lots NUMBER;
        old_ltp NUMBER;
        old_blocked VARCHAR2(2);
    BEGIN
    -- Get the old values of the updated fields
    
    
        old_symbol := :OLD.symbol;
        old_price := :OLD.price;
        old_value := :OLD.value;
        old_available_lots := :OLD.available_lots;
        old_ltp := :OLD.ltp;
        old_blocked := :OLD.blocked;
    

    -- Insert a row into the admin_log table
    IF INSERTING THEN
            INSERT INTO user_log (user_id, event_type, description)
    VALUES (:NEW.CORP_ID,'STOCK INSERT','Your symbol '||:new.SYMBOL||' has been registered');
        
        
        INSERT INTO admin_log (event_type, description, event_time)
        VALUES ('INSERT',
            'New stock ' || :NEW.symbol || ' added',
            SYSDATE);
    ELSIF UPDATING THEN
        IF :NEW.symbol != :OLD.symbol THEN
                INSERT INTO user_log (user_id, event_type, description)
    VALUES (:NEW.CORP_ID,'STOCK UPDATE','Your symbol updated from ' || old_symbol || ' to ' || :NEW.symbol);
            
        INSERT INTO admin_log (event_type, description, event_time)
        VALUES ('UPDATE',
                'Symbol updated from ' || old_symbol || ' to ' || :NEW.symbol,
                SYSDATE);
        END IF;

        IF :NEW.price != :OLD.price THEN
                INSERT INTO user_log (user_id, event_type, description)
    VALUES (:NEW.CORP_ID,'STOCK UPDATE','Your price updated from ' || old_price || ' to ' || :NEW.price);
            
        INSERT INTO admin_log (event_type, description, event_time)
        VALUES ('UPDATE',
                'Price of '|| :new.symbol ||' updated from ' || old_price || ' to ' || :NEW.price,
                SYSDATE);
        END IF;

        IF :NEW.value != :OLD.value THEN
                INSERT INTO user_log (user_id, event_type, description)
    VALUES (:NEW.CORP_ID,'STOCK UPDATE','Your value updated from ' || old_value || ' to ' || :NEW.VALUE);
        
        INSERT INTO admin_log (event_type, description, event_time)
        VALUES ('UPDATE',
                'Value of '|| :new.symbol ||' updated from ' || old_value || ' to ' || :NEW.value,
                SYSDATE);
        END IF;

        IF :NEW.available_lots != :OLD.available_lots THEN
                INSERT INTO user_log (user_id, event_type, description)
    VALUES (:NEW.CORP_ID,'STOCK UPDATE','Your available lots updated from ' || old_available_lots || ' to ' || :NEW.available_lots);
            
        INSERT INTO admin_log (event_type, description, event_time)
        VALUES ('UPDATE',
                'Available lots of '|| :new.symbol ||' updated from ' || old_available_lots || ' to ' || :NEW.available_lots,
                SYSDATE);
        END IF;

        IF :NEW.ltp != :OLD.ltp THEN
                INSERT INTO user_log (user_id, event_type, description)
    VALUES (:NEW.CORP_ID,'STOCK UPDATE','Your ltp updated from ' || old_ltp || ' to ' || :NEW.ltp);
            
            
        INSERT INTO admin_log (event_type, description, event_time)
        VALUES ('UPDATE',
                'LTP  of '|| :new.symbol ||' updated from ' || old_ltp || ' to ' || :NEW.ltp,
                SYSDATE);
        END IF;

        IF :NEW.blocked != :OLD.blocked THEN
                INSERT INTO user_log (user_id, event_type, description)
    VALUES (:NEW.CORP_ID,'STOCK UPDATE','Your blocked status updated from ' || old_blocked || ' to ' || :NEW.blocked);
            
            
        INSERT INTO admin_log (event_type, description, event_time)
        VALUES ('UPDATE',
                'Blocked status of '|| :new.symbol ||' updated from ' || old_blocked || ' to ' || :NEW.blocked,
                SYSDATE);
        END IF;
    END IF;
    END;
    /
    ```


3. update_stock_time
    ```sql
    CREATE OR REPLACE TRIGGER update_stock_time
    BEFORE UPDATE ON STOCK
    FOR EACH ROW
    BEGIN
        :NEW.UPDATE_TIME := CURRENT_TIMESTAMP;
    END;
    /
    ```

4. update_corresponding_symbols
    ```sql
    CREATE OR REPLACE TRIGGER update_corresponding_symbols
    AFTER UPDATE OF SYMBOL ON STOCK
    FOR EACH ROW
    BEGIN
        -- Update symbol in BACKUP_STOCK
        UPDATE "BACKUP STOCK"
        SET SYMBOL = :new.SYMBOL
        WHERE SYMBOL = :old.SYMBOL;
        
        -- Update symbol in ORDER
        UPDATE "ORDER"
        SET SYMBOL = :new.SYMBOL
        WHERE SYMBOL = :old.SYMBOL;
        
        -- Update symbol in OWNS
        UPDATE OWNS
        SET SYMBOL = :new.SYMBOL
        WHERE SYMBOL = :old.SYMBOL;
    END;
    /
    ```

5. insert_corp_into_owns
    ```sql
    CREATE OR REPLACE TRIGGER insert_corp_into_owns
    AFTER INSERT 
    ON STOCK 
    FOR EACH ROW 
    BEGIN
    IF :NEW.AVAILABLE_LOTS IS NOT NULL AND :NEW.LOT IS NOT NULL THEN 
        INSERT INTO OWNS VALUES(:NEW.CORP_ID,:NEW.SYMBOL,:NEW.AVAILABLE_LOTS*:NEW.LOT);
    END IF;
    END;
    / 
    ```

6. update_quantity_of_stock
    ```sql
    CREATE OR REPLACE TRIGGER update_quantity_of_stock
    AFTER UPDATE OF AVAILABLE_LOTS,LOT 
    ON STOCK 
    FOR EACH ROW
    BEGIN 
    UPDATE OWNS 
    SET QUANTITY = :NEW.AVAILABLE_LOTS*:NEW.LOT 
    WHERE USER_ID = :NEW.CORP_ID AND SYMBOL = :NEW.SYMBOL;
    END;
    /
    ```

7. update_blocked_flag
    ```sql
    CREATE OR REPLACE TRIGGER update_blocked_flag
    AFTER UPDATE OF BLOCKED ON stock
    FOR EACH ROW
    DECLARE 
    COUNT_SYM NUMBER;
    BEGIN
            SELECT COUNT(SYMBOL) INTO COUNT_SYM FROM "BACKUP STOCK" WHERE SYMBOL = :NEW.SYMBOL;
            IF COUNT_SYM = 0 THEN 
                UPDATE "BACKUP STOCK"
                SET blocked = :NEW.BLOCKED
                WHERE SYMBOL = :new.SYMBOL;
            END IF;
    END;
    /
    ```





8. delete_order_on_blocking_stock
    ```sql
    CREATE OR REPLACE TRIGGER delete_order_on_blocking_stock
    AFTER UPDATE OF BLOCKED 
    ON STOCK 
    FOR EACH ROW 
    BEGIN 
        IF :NEW.BLOCKED = 'T' THEN 
            DELETE FROM "ORDER" 
            WHERE SYMBOL = :NEW.SYMBOL AND STATUS = 'PENDING';
        END IF;
    END;
    /
    ```

9. delete_owns_on_deleting_user 
    ```sql
    CREATE OR REPLACE TRIGGER delete_owns_on_deleting_user 
    AFTER UPDATE OF IS_DELETED 
    ON "USER"
    FOR EACH ROW 
    BEGIN 
        IF :NEW.IS_DELETED = 'T' THEN 
                DELETE FROM OWNS 
                WHERE USER_ID = :NEW.USER_ID;
        END IF;
    END;
    /
    ```



### User
1. reg_user
    ```sql
    CREATE OR REPLACE TRIGGER REG_USER 
    AFTER INSERT 
    ON "USER"
    FOR EACH ROW
    BEGIN 
        INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:NEW.USER_ID,'Register','Congrats '||:new.name||' , you have been registered');
        INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('Register','New '||INITCAP(:NEW."TYPE")||' '||:NEW.USER_ID||' has registered successfully');
    END;
    / 
    ```

2. update_user
    ```sql
    CREATE OR REPLACE TRIGGER update_user
    AFTER UPDATE OF name, email, street_no, street_name, city, country, zip
    ON "USER"
    FOR EACH ROW
    DECLARE
        old_name VARCHAR2(255);
        old_email VARCHAR2(255);
        old_street_no NUMBER;
        old_street_name VARCHAR2(255);
        old_city VARCHAR2(255);
        old_country VARCHAR2(255);
        old_zip VARCHAR2(20);
    BEGIN
    -- Get the old values of the updated fields
    
    
        old_name := :OLD.name;
        old_email := :OLD.email;
        old_street_no := :OLD.street_no;
        old_street_name := :OLD.street_name;
        old_city := :OLD.city;
        old_country := :OLD.country;
        old_zip := :OLD.zip;

    -- Insert a row into the user_log table
    IF :NEW.name != :OLD.name THEN
        INSERT INTO user_log (user_id, event_type, description, event_time)
        VALUES (:NEW.user_id, 'UPDATE', 'Name updated from ' || old_name || ' to ' || :NEW.name, SYSDATE);
    END IF;

    IF :NEW.email != :OLD.email THEN
        INSERT INTO user_log (user_id, event_type, description, event_time)
        VALUES (:NEW.user_id, 'UPDATE', 'Email updated from ' || old_email || ' to ' || :NEW.email, SYSDATE);
    END IF;

    IF :NEW.street_no != :OLD.street_no THEN
        INSERT INTO user_log (user_id, event_type, description, event_time)
        VALUES (:NEW.user_id, 'UPDATE', 'Street no updated from ' || old_street_no || ' to ' || :NEW.street_no, SYSDATE);
    END IF;

    IF :NEW.street_name != :OLD.street_name THEN
        INSERT INTO user_log (user_id, event_type, description, event_time)
        VALUES (:NEW.user_id, 'UPDATE', 'Street name updated from ' || old_street_name || ' to ' || :NEW.street_name, SYSDATE);
    END IF;

    IF :NEW.city != :OLD.city THEN
        INSERT INTO user_log (user_id, event_type, description, event_time)
        VALUES (:NEW.user_id, 'UPDATE', 'City updated from ' || old_city || ' to ' || :NEW.city, SYSDATE);
    END IF;

    IF :NEW.country != :OLD.country THEN
        INSERT INTO user_log (user_id, event_type, description, event_time)
        VALUES (:NEW.user_id, 'UPDATE', 'Country updated from ' || old_country || ' to ' || :NEW.country, SYSDATE);
    END IF;

    IF :NEW.zip != :OLD.zip THEN
        INSERT INTO user_log (user_id, event_type, description, event_time)
        VALUES (:NEW.user_id, 'UPDATE', 'Zip updated from ' || old_zip || ' to ' || :NEW.zip, SYSDATE);
    END IF;

    -- Insert a row into the admin_log table
    INSERT INTO admin_log (event_type, DESCRIPTION, event_time)
    VALUES ('UPDATE',
            'User information updated for user_id = ' || :NEW.user_id,
            SYSDATE);
    END;
    /
    ```

3. delete_participation_on_deleting_user
    ```sql
    CREATE OR REPLACE TRIGGER delete_participation_on_deleting_user
    AFTER UPDATE OF IS_DELETED
    ON "USER"
    FOR EACH ROW 
    DECLARE
    START_DATE TIMESTAMP;
    BEGIN 
        IF :NEW.IS_DELETED = 'T' THEN 
            FOR R IN (
                SELECT ACTIVITY_ID 
                FROM PARTICIPATION WHERE 
                USER_ID = :NEW.USER_ID
            )
            LOOP 
            SELECT START_TIME INTO START_DATE FROM ACTIVITY WHERE ACTIVITY_ID = R.ACTIVITY_ID;
            IF START_DATE >= CURRENT_TIMESTAMP THEN 
                DELETE FROM PARTICIPATION 
                WHERE ACTIVITY_ID = R.ACTIVITY_ID AND USER_ID = :NEW.USER_ID;
            END IF;
            END LOOP;
        END IF;
    END;
    /
    ```

4. delete_user
    ```sql
    CREATE OR REPLACE TRIGGER delete_user
    AFTER UPDATE OF IS_DELETED 
    ON "USER"
    FOR EACH ROW 
    BEGIN
        IF :NEW.IS_DELETED = 'T' THEN  
        INSERT INTO user_log (user_id, event_type, description) 
        VALUES (:NEW.user_id,'DELETE','Account of '||:OLD.NAME || ' has been deleted');
        INSERT INTO admin_log (event_type, DESCRIPTION) 
        VALUES ('DELETE','Account of '||:OLD.USER_ID || ' has been deleted');
        END IF;
    END;
    /
    ```


5. INSERT_REG_DATE
    ```sql
    CREATE 
        OR REPLACE TRIGGER INSERT_REG_DATE BEFORE INSERT ON "USER" FOR EACH ROW
    BEGIN
            : NEW.REG_DATE := SYSDATE;
    END;
    /
    ```

6. update_deleted_flag
    ```sql
    CREATE OR REPLACE TRIGGER update_deleted_flag
    AFTER UPDATE OF IS_DELETED 
    ON "USER"
    FOR EACH ROW
    BEGIN
        IF :old."TYPE" = 'Customer' THEN
            UPDATE customer
            SET IS_DELETED = :NEW.IS_DELETED
            WHERE user_id = :new.user_id;
        ELSIF :old."TYPE" = 'Corp' THEN
            UPDATE corporation
            SET IS_DELETED = :NEW.IS_DELETED
            WHERE corp_id = :new.user_id;
        ELSIF :old."TYPE" = 'Broker' THEN
            UPDATE broker
            SET IS_DELETED = :NEW.IS_DELETED
            WHERE user_id = :new.user_id;
        ELSIF :old."TYPE" = 'Admin' THEN
            UPDATE admin
            SET IS_DELETED = :NEW.IS_DELETED
            WHERE admin_id = :new.user_id;
        END IF;
    END;
    / 
    ```



7. delete_user_contact
    ```sql
    CREATE OR REPLACE TRIGGER delete_user_contact
    AFTER UPDATE OF IS_DELETED 
    ON "USER"
    FOR EACH ROW
    DECLARE
    COUNT_CONTACT NUMBER;
    BEGIN
        IF :NEW.IS_DELETED = 'T' THEN  
            SELECT COUNT(*) INTO COUNT_CONTACT FROM USER_CONTACT WHERE USER_ID = :NEW.USER_ID;
            IF COUNT_CONTACT > 0 THEN 
                DELETE FROM USER_CONTACT WHERE USER_ID = :NEW.USER_ID; 
            END IF;
        END IF;
    END;
    / 
    ```


8. delete_order_on_deleting_user
    ```sql
    CREATE OR REPLACE TRIGGER delete_order_on_deleting_user
    AFTER UPDATE OF IS_DELETED 
    ON "USER"
    FOR EACH ROW 
    BEGIN 
        IF :NEW.IS_DELETED = 'T' THEN 
            DELETE FROM "ORDER" 
            WHERE USER_ID = :NEW.USER_ID AND STATUS = 'PENDING';
        END IF;
    END;
    /
    ```

### User_contact
1. mod_contact
    ```sql
    CREATE OR REPLACE TRIGGER mod_contact
    AFTER INSERT OR DELETE
    ON USER_CONTACT
    FOR EACH ROW
    BEGIN
    IF INSERTING THEN 
    INSERT INTO user_log (user_id, event_type, description)
    VALUES (:NEW.user_id, 'ADD_CONTACT','New contact added ' || :NEW.contact);

    INSERT INTO admin_log (event_type, description)
    VALUES ('ADD_CONTACT', :NEW.user_id || ' has added contact ' || :NEW.contact);
    ELSIF DELETING THEN 
        INSERT INTO user_log (user_id, event_type, description)
    VALUES (:OLD.user_id, 'DELETE_CONTACT','Contact deleted ' || :OLD.contact);

    INSERT INTO admin_log (event_type, description)
    VALUES ('DELETE_CONTACT', :OLD.user_id || ' has deleted contact ' || :OLD.contact);
    END IF;
    END;
    /
    ```


