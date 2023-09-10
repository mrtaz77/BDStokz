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

CREATE OR REPLACE TRIGGER delete_participation_of_upcoming_activity 
AFTER DELETE 
ON ACTIVITY
FOR EACH ROW 
BEGIN 
	DELETE FROM PARTICIPATION 
	WHERE ACTIVITY_ID = :OLD.ACTIVITY_ID;
END;
/

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