CREATE OR REPLACE TRIGGER order_update_trigger 
BEFORE UPDATE OF LATEST_PRICE,LATEST_QUANTITY,STATUS
ON "ORDER"
FOR EACH ROW
DECLARE 
TYP VARCHAR2(20);
NUM_SHARES NUMBER;
ALLOWED_SHARES NUMBER;
BEGIN 
	SELECT LOT INTO NUM_SHARES FROM STOCK WHERE SYMBOL = :NEW.SYMBOL;
	SELECT LOT*AVAILABLE_LOTS INTO ALLOWED_SHARES FROM STOCK WHERE SYMBOL = :NEW.SYMBOL;
	IF :NEW.LATEST_QUANTITY*NUM_SHARES > ALLOWED_SHARES THEN 
		 RAISE_APPLICATION_ERROR(-20003,'Invalid amount of stock');
	END IF;
	:NEW.LATEST_QUANTITY := :NEW.LATEST_QUANTITY*NUM_SHARES;
	SELECT "TYPE" INTO TYP FROM "USER" WHERE USER_ID = :NEW.USER_ID;
	IF TYP = 'Admin' THEN 
		:NEW.TRANSACTION_FEE := 0;
	ELSIF TYP = 'Customer'  THEN  
		:NEW.TRANSACTION_FEE := ROUND(:NEW.LATEST_PRICE * :NEW.LATEST_QUANTITY * 0.05 / 100,0);
	ELSE
		RAISE_APPLICATION_ERROR(-20001,'User not permitted');
	END IF;
	IF :NEW.STATUS IN ('SUCCESS','FAILURE') THEN 
		:NEW.TRANSACTION_TIME := CURRENT_TIMESTAMP;
	END IF;
	IF :NEW.STATUS = 'FAILURE' AND :NEW."TYPE" = 'SELL' THEN 
		RAISE_APPLICATION_ERROR(-20004,'Sell order can never fail');
	END IF; 
	IF :NEW.STATUS IN ('FAILURE') THEN 
		:NEW.TRANSACTION_FEE := 0;
	END IF;
	:NEW.LATEST_UPDATE_TIME := CURRENT_TIMESTAMP;
END;
/ 