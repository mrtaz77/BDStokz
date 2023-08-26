CREATE OR REPLACE FUNCTION TIME_TO_EPOCH(TM IN TIMESTAMP)RETURN DECIMAL IS 
EP DECIMAL(20,4);
BEGIN 
	EP := 0;
	SELECT
		ROUND( ( CAST( SYS_EXTRACT_UTC( TM ) AS DATE ) - TO_DATE( '1970-01-01 00:00:00', 'YYYY-MM-DD HH24:MI:SS' ) ) * 86400, 4 ) INTO EP 
	FROM
		DUAL;
	DBMS_OUTPUT.PUT_LINE(EP);
		RETURN EP;
EXCEPTION
	WHEN OTHERS THEN 
		RETURN -404;
END;