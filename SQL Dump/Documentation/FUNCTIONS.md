# Functions 
#### [PWD_HASH](#pwd_hash-1)
#### [CHK_CREDS_NAME](#chk_creds_name-1)
#### [BROKER_COMMISSION_PCT](#broker_commission_pct-1)
#### [FORMAT_TIMESTAMP_ORDER](#format_timestamp_order-1)
#### [DURATION_FORMAT](#duration_format-1)

## DURATION_FORMAT
- Input : Duration in minutes . Ex : 45 , 75
- Output : Formatted duration . Ex : 45 min , 1 hr 15 min
```sql 
CREATE OR REPLACE FUNCTION DURATION_FORMAT(T IN NUMBER)RETURN VARCHAR2 IS 
TIME VARCHAR2(20);
H NUMBER;
M NUMBER;
BEGIN
	TIME := ''; 
	H := TRUNC(T/60);
	M := (T-TRUNC(T/60)*60);
	IF H > 0 THEN 
		TIME := TIME || H || ' hr ';
	END IF;
	IF M > 0 THEN 
		TIME := TIME || M || ' min';
	END IF;
	RETURN TIME;
EXCEPTION
	WHEN OTHERS THEN 
		RETURN '';
END;
/
```



## PWD_HASH
- The string is first encoded using base64 encoding and then it is hashed using sha - 512 algorithm.

```sql
CREATE OR REPLACE FUNCTION PWD_HASH(input_string IN VARCHAR2)
RETURN VARCHAR2
IS
  encoded_string VARCHAR2(32767);
  hash_raw RAW(64);
  hash_output VARCHAR2(128);
BEGIN
  encoded_string := UTL_RAW.CAST_TO_VARCHAR2(UTL_ENCODE.BASE64_ENCODE(UTL_RAW.CAST_TO_RAW(input_string)));

  SELECT STANDARD_HASH(encoded_string,'SHA512') INTO hash_raw FROM DUAL;

  hash_output := RAWTOHEX(hash_raw);

  RETURN hash_output;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
/
```

## CHK_CREDS_NAME
```sql
CREATE OR REPLACE FUNCTION CHK_CREDS_NAME(USER_NAME IN VARCHAR2,USER_PWD IN VARCHAR2)RETURN NUMBER IS 
	CHK_PWD VARCHAR2(128);
	CHK_USER NUMBER;
BEGIN
	SELECT COUNT(USER_ID) INTO CHK_USER FROM "USER" WHERE NAME = USER_NAME AND IS_DELETED = 'F';
	
	IF CHK_USER = 0 THEN 
		RETURN -404;
	ELSE 
			SELECT PWD INTO CHK_PWD FROM "USER" WHERE NAME = USER_NAME AND IS_DELETED = 'F';
			
			IF CHK_PWD = PWD_HASH(USER_PWD) THEN 
				RETURN 1337;
			ELSE
				RETURN -404;
			END IF;
	END IF;
EXCEPTION
		WHEN NO_DATA_FOUND THEN 
			RETURN -1;
END;
/
```

## BROKER_COMMISSION_PCT
- The range of commission percentage lies between 0.01 and 4.
- For every 100000 shares (latest_quantity) transaction done via successful orders of the customers of the broker, the percentage increases by 1.
- The broker and customers under jurisdiction must have active accounts in the website.

```sql
CREATE OR REPLACE FUNCTION broker_commission_pct (BID IN NUMBER) RETURN NUMBER IS 
COM_PCT NUMBER (5,2);
CHK_BID NUMBER; 
BEGIN 
SELECT COUNT(USER_ID) INTO CHK_BID FROM BROKER WHERE USER_ID = BID AND IS_DELETED = 'F';

IF CHK_BID = 0 THEN 
	RETURN 0;
ELSE 
SELECT LEAST(0.01 + ROUND(NVL(SUM(LATEST_QUANTITY),0)/100000,0)*0.01,4) INTO COM_PCT
FROM CUSTOMER LEFT OUTER JOIN "ORDER" ON "ORDER".USER_ID = CUSTOMER.USER_ID
WHERE STATUS = 'SUCCESS' AND BROKER_ID = BID AND CUSTOMER.IS_DELETED = 'F';
END  IF;
RETURN COM_PCT;
EXCEPTION
WHEN OTHERS THEN 
	RETURN 0;
END;
/
```

## FORMAT_TIMESTAMP_ORDER
- Input : Timestamp(sql datatype) Ex : 2023-09-21 14:58:32.138000
- Output : Formatted string . Ex : 21-SEP-2023 02:58:32 PM.

```sql
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
/
```



