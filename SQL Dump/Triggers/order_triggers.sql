CREATE OR REPLACE FUNCTION SECTOR_OF_STOCK(SYM IN VARCHAR2)RETURN VARCHAR2 IS
SEC VARCHAR2(40);
BEGIN
SELECT SECTOR INTO SEC FROM CORPORATION NATURAL JOIN STOCK WHERE SYMBOL = SYM AND BLOCKED = 'F';
RETURN SEC;
EXCEPTION
	WHEN OTHERS THEN RETURN '';
END;
/

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


CREATE OR REPLACE TRIGGER latest_update_time_set
BEFORE INSERT OR UPDATE
ON "ORDER"
FOR EACH ROW 
BEGIN
    :NEW.LATEST_UPDATE_TIME := CURRENT_TIMESTAMP;
END;
/

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
                ELSE 
                    UPDATE ADMIN 
                    SET FUNDS = FUNDS - :NEW.LATEST_PRICE * :NEW.LATEST_QUANTITY 
                    WHERE ADMIN_ID = :NEW.USER_ID;
                END IF;
            END IF;
        END IF;
	END IF;
END;
/



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

        UPDATE OWNS
        SET QUANTITY = QUANTITY - :NEW.LATEST_QUANTITY
        WHERE USER_ID = (SELECT CORP_ID FROM STOCK WHERE SYMBOL = :NEW.SYMBOL) AND SYMBOL = :NEW.SYMBOL;
		END IF;
END;
/

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



CREATE OR REPLACE PROCEDURE sell_order_success(
    OID IN NUMBER
    ,BUYER_ID IN VARCHAR2
)IS 
ORDER_SYM VARCHAR2(30);
LATEST_QUANTITY NUMBER(10,2);
LATEST_PRICE NUMBER(10,2);
SELLER_ID NUMBER(10,2);
TYP VARCHAR2(30);
SYM VARCHAR2(40);
COUNT_SYM NUMBER;
USID NUMBER;
FLAG NUMBER;
FUND NUMBER(10,2);
NUM_LOT NUMBER(10,2);
BEGIN
    SELECT SYMBOL INTO ORDER_SYM FROM "ORDER" WHERE ORDER_ID = OID;
    SELECT USER_ID INTO SELLER_ID FROM "ORDER" WHERE ORDER_ID = OID;
    SELECT LATEST_PRICE INTO LATEST_PRICE FROM "ORDER" WHERE ORDER_ID = OID;
    SELECT LATEST_QUANTITY INTO LATEST_QUANTITY FROM "ORDER" WHERE ORDER_ID = OID;
		
    IF BUYER_ID = SELLER_ID THEN 
        RAISE_APPLICATION_ERROR(-20008,'Buyer and seller must be different');
    END IF;


    SELECT "TYPE" INTO TYP FROM "USER" WHERE USER_ID = BUYER_ID;
    IF TYP = 'Customer' THEN 
        SELECT COUNT(*) INTO COUNT_SYM 
        FROM OWNS WHERE SYMBOL = ORDER_SYM AND USER_ID = BUYER_ID;
                    
        IF COUNT_SYM = 0 THEN 
            INSERT INTO OWNS VALUES(BUYER_ID,ORDER_SYM,LATEST_QUANTITY);
        ELSE 
            UPDATE OWNS
            SET QUANTITY = QUANTITY + LATEST_QUANTITY
            WHERE USER_ID = BUYER_ID AND SYMBOL = ORDER_SYM;
        END IF;

        SELECT COUNT(*) INTO FLAG 
        FROM PORTFOLIO WHERE SECTOR = SECTOR_OF_STOCK(ORDER_SYM) AND USER_ID = BUYER_ID;
        
        IF FLAG = 0 THEN
            INSERT INTO PORTFOLIO VALUES (BUYER_ID,SECTOR_OF_STOCK(ORDER_SYM),LATEST_PRICE*LATEST_QUANTITY,0);
        ELSE 
            UPDATE PORTFOLIO
            SET BUY_AMOUNT = BUY_AMOUNT + LATEST_PRICE*LATEST_QUANTITY
            WHERE USER_ID = BUYER_ID AND SECTOR = SECTOR_OF_STOCK(ORDER_SYM);
        END IF;
    ELSIF TYP = 'Admin' THEN 
        FUND := 0;
        SELECT FUNDS INTO FUND FROM ADMIN WHERE ADMIN_ID = BUYER_ID;

        IF FUND < LATEST_PRICE*LATEST_QUANTITY THEN 
            RAISE_APPLICATION_ERROR(-20007,'Insufficient funds');
        END IF;

        UPDATE ADMIN
        SET FUNDS = FUNDS - LATEST_PRICE*LATEST_QUANTITY
        WHERE ADMIN_ID = BUYER_ID;


		SELECT COUNT(*) INTO COUNT_SYM 
        FROM "BACKUP STOCK"
        WHERE SYMBOL = ORDER_SYM;
				
		SELECT LOT INTO NUM_LOT FROM STOCK WHERE SYMBOL = ORDER_SYM ;

        IF COUNT_SYM = 0 THEN
            INSERT INTO "BACKUP STOCK" VALUES (ORDER_SYM,LATEST_QUANTITY/NUM_LOT,'F');
        ELSE 
            UPDATE "BACKUP STOCK" 
            SET AVAILABLE_LOTS = AVAILABLE_LOTS + (LATEST_QUANTITY/NUM_LOT)
            WHERE SYMBOL = ORDER_SYM;
        END IF;
    END IF;

    UPDATE "ORDER"
    SET STATUS = 'SUCCESS'
    WHERE ORDER_ID = OID;
EXCEPTION
WHEN OTHERS THEN 
	ROLLBACK;
END;
/