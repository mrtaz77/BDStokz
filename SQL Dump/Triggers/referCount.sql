CREATE 
	OR REPLACE TRIGGER referCountUpdate FOR INSERT 
	OR DELETE ON CUSTOMER COMPOUND TRIGGER TYPE customer_record_type IS RECORD ( user_id NUMBER, referer_id NUMBER );
TYPE customer_table_type IS TABLE OF customer_record_type;
customer_table customer_table_type := customer_table_type ( );
BEFORE STATEMENT IS BEGIN
	customer_table := customer_table_type ( );
	
END BEFORE STATEMENT;
AFTER EACH ROW
IS BEGIN
	IF
		INSERTING THEN
			customer_table.EXTEND;
		customer_table ( customer_table.LAST ).user_id := : NEW.USER_ID;
		customer_table ( customer_table.LAST ).referer_id := : NEW.REFERER_ID;
		ELSIF DELETING THEN
			customer_table.EXTEND;
			customer_table ( customer_table.LAST ).user_id := : OLD.USER_ID;
			customer_table ( customer_table.LAST ).referer_id := : OLD.REFERER_ID;
			
		END IF;
		
	END AFTER EACH ROW
;
AFTER STATEMENT IS BEGIN
	FOR i IN 1..customer_table.COUNT
	LOOP
	IF
		INSERTING THEN-- Increase REFER_COUNT for the REFERER customer
			UPDATE CUSTOMER 
			SET REFER_COUNT = REFER_COUNT + 1 
		WHERE
			USER_ID = customer_table ( i ).referer_id;
		ELSIF DELETING THEN-- Decrease REFER_COUNT for the REFERER customer
			UPDATE CUSTOMER 
			SET REFER_COUNT = REFER_COUNT - 1 
			WHERE
				USER_ID = customer_table ( i ).referer_id;
			
		END IF;
		
	END LOOP;

END AFTER STATEMENT;
END;
/





