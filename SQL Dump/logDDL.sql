CREATE SEQUENCE userLog_id_seq START WITH 100 INCREMENT BY 10 NOCACHE NOCYCLE;
CREATE SEQUENCE adminLog_id_seq START WITH 100 INCREMENT BY 10 NOCACHE NOCYCLE;

DROP TABLE ADMIN_LOG;

CREATE TABLE USER_LOG (
  USER_LOG_ID INTEGER DEFAULT userLog_id_seq.NEXTVAL NOT NULL,
  USER_ID INTEGER NOT NULL,
  EVENT_TYPE VARCHAR2(50),
  DESCRIPTION VARCHAR2(255),
  EVENT_TIME DATE DEFAULT SYSDATE,
  CONSTRAINT PK_USER_LOG PRIMARY KEY (USER_LOG_ID),
  CONSTRAINT FK_USER_LOG FOREIGN KEY (USER_ID) REFERENCES "USER" (USER_ID) ON DELETE SET NULL
);

CREATE TABLE "ADMIN_LOG" (
  ADMIN_LOG_ID NUMBER DEFAULT adminLog_id_seq.NEXTVAL NOT NULL,
  EVENT_TYPE VARCHAR2(50),
  DESCRIPTION VARCHAR2(255),
  EVENT_TIME DATE DEFAULT SYSDATE,
	CONSTRAINT PK_ADMIN_LOG PRIMARY KEY (ADMIN_LOG_ID)
);

CREATE OR REPLACE TRIGGER REG_USER 
AFTER INSERT 
ON "USER"
FOR EACH ROW
BEGIN 
	INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:NEW.USER_ID,'Register','Congrats '||:new.name||' , you have been registered');
	INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('Register','New '||INITCAP(:NEW."TYPE")||' '||:NEW.USER_ID||' has registered successfully');
END;
/ 

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


CREATE OR REPLACE TRIGGER owns_log 
BEFORE INSERT OR UPDATE OF QUANTITY
ON OWNS 
FOR EACH ROW
BEGIN 
	IF INSERTING THEN
		INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:new.USER_ID,'NEW OWNERSHIP','You now own '||:new.QUANTITY||' of '||:new.SYMBOL);
		INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('NEW OWNERSHIP',:new.user_id||' now owns '||:new.QUANTITY||' of '||:new.SYMBOL);
	ELSIF UPDATING('QUANTITY') THEN 
		INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:new.USER_ID,'UPDATE OWNERSHIP','You now own '||:new.QUANTITY||' of '||:new.SYMBOL);
		INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('UPDATE OWNERSHIP',:new.user_id||' now owns '||:new.QUANTITY||' of '||:new.SYMBOL);
	END IF;
END;
/  

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

CREATE OR REPLACE TRIGGER admin_funds_update 
AFTER UPDATE OF FUNDS 
ON ADMIN 
FOR EACH ROW 
BEGIN 
INSERT INTO USER_LOG(USER_ID,EVENT_TYPE,DESCRIPTION) VALUES (:NEW.ADMIN_ID,'FUNDS UPDATE','Your funds changed from '||:OLD.FUNDS||' -> '||:NEW.FUNDS);
INSERT INTO ADMIN_LOG(EVENT_TYPE,DESCRIPTION) VALUES ('FUNDS UPDATE',:NEW.ADMIN_ID||' : '||:OLD.FUNDS||' -> '||:NEW.FUNDS);
END;
/