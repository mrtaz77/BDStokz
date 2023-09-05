CREATE OR REPLACE FUNCTION format_timestamp_order(
    inputTimestamp TIMESTAMP
) RETURN VARCHAR2
IS
    formattedTimestamp VARCHAR2(100);
BEGIN
    -- Format the timestamp as a human-readable string
    SELECT TO_CHAR(inputTimestamp, 'DD-MON-YYYY HH:MI:SS AM', 'NLS_DATE_LANGUAGE=ENGLISH')
    INTO formattedTimestamp
    FROM DUAL;

    RETURN formattedTimestamp;
EXCEPTION 
	WHEN OTHERS THEN 
		RETURN '';
END;