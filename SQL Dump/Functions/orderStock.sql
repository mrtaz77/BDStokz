CREATE 
	OR REPLACE FUNCTION OPEN ( SYM IN VARCHAR2 ) RETURN NUMBER IS OP NUMBER ( 10, 4 );
BEGIN
		OP := 0.0000;
	SELECT
		O1.LATEST_PRICE INTO OP 
	FROM
		"ORDER" O1 
	WHERE
		O1.SYMBOL = SYM 
		AND O1.STATUS = 'SUCCESS' 
		AND TRUNC( O1.TRANSACTION_TIME ) >= ALL ( SELECT TRUNC( O2.TRANSACTION_TIME ) FROM "ORDER" O2 WHERE O2.SYMBOL = SYM AND O2.STATUS = 'SUCCESS' ) 
		AND TO_TIMESTAMP( TO_CHAR( O1.TRANSACTION_TIME, 'HH24-MI-SS' ), 'HH24-MI-SS' ) <= ALL (
		SELECT
			TO_TIMESTAMP( TO_CHAR( O3.TRANSACTION_TIME, 'HH24-MI-SS' ), 'HH24-MI-SS' ) 
		FROM
			"ORDER" O3 
		WHERE
			O3.SYMBOL = O1.SYMBOL 
			AND TRUNC( O3.TRANSACTION_TIME ) = TRUNC( O1.TRANSACTION_TIME ) 
			AND O3.STATUS = 'SUCCESS' 
		)
		ORDER BY O1.ORDER_ID DESC
		FETCH FIRST 1 ROW ONLY
		;
	RETURN OP;
	EXCEPTION 
		WHEN OTHERS THEN
		RETURN 0;
END;
/

CREATE OR REPLACE FUNCTION CLOSE(SYM IN VARCHAR2)RETURN NUMBER IS
CL NUMBER(10,4);
BEGIN
	CL := 0.0000;
	SELECT O1.LATEST_PRICE INTO CL
	FROM "ORDER" O1 
	WHERE O1.SYMBOL = SYM AND O1.STATUS = 'SUCCESS' AND 
	TRUNC(O1.TRANSACTION_TIME) >= ALL(SELECT TRUNC(O2.TRANSACTION_TIME) FROM "ORDER" O2 WHERE O2.SYMBOL = SYM AND O2.STATUS = 'SUCCESS') AND 
	TO_TIMESTAMP( TO_CHAR( O1.TRANSACTION_TIME, 'HH24-MI-SS' ), 'HH24-MI-SS' ) >= ALL (
	SELECT
		TO_TIMESTAMP( TO_CHAR( O3.TRANSACTION_TIME, 'HH24-MI-SS' ), 'HH24-MI-SS' ) 
	FROM
		"ORDER" O3 
	WHERE
		O3.SYMBOL = O1.SYMBOL 
		AND O3.STATUS = 'SUCCESS'
		AND TRUNC( O3.TRANSACTION_TIME ) = TRUNC( O1.TRANSACTION_TIME ) 
	)
	ORDER BY O1.ORDER_ID DESC
		FETCH FIRST 1 ROW ONLY
	 ;
	RETURN CL;
EXCEPTION
	WHEN OTHERS THEN 
		RETURN 0;
END;
/

CREATE OR REPLACE FUNCTION HIGH(SYM IN VARCHAR2)RETURN NUMBER IS
HIGH NUMBER(10,4);
BEGIN
	HIGH := 0.0000;
	SELECT MAX(O1.LATEST_PRICE) INTO HIGH
	FROM "ORDER" O1 
	WHERE O1.SYMBOL = SYM AND O1.STATUS = 'SUCCESS' AND
	TRUNC(O1.TRANSACTION_TIME) >= ALL(SELECT TRUNC(O2.TRANSACTION_TIME) FROM "ORDER" O2 WHERE O2.SYMBOL = SYM AND O2.STATUS = 'SUCCESS')
	GROUP BY 
	SYMBOL,TRUNC(O1.TRANSACTION_TIME);
	RETURN HIGH;
EXCEPTION
	WHEN OTHERS THEN 
		RETURN 0;
END;
/

CREATE OR REPLACE FUNCTION LOW(SYM IN VARCHAR2)RETURN NUMBER IS
LOW NUMBER(10,4);
BEGIN
	LOW := 0.0000;
	SELECT MIN(O1.LATEST_PRICE) INTO LOW
	FROM "ORDER" O1 
	WHERE O1.SYMBOL = SYM AND O1.STATUS = 'SUCCESS' AND 
	TRUNC(O1.TRANSACTION_TIME) >= ALL(SELECT TRUNC(O2.TRANSACTION_TIME) FROM "ORDER" O2 WHERE O2.SYMBOL = SYM AND O2.STATUS = 'SUCCESS')
	GROUP BY 
	SYMBOL,TRUNC(O1.TRANSACTION_TIME);
	RETURN LOW;
EXCEPTION
	WHEN OTHERS THEN 
		RETURN 0;
END;
/

-- SQL for testing purposes
SELECT SYMBOL,OPEN(SYMBOL) OPEN,CLOSE(SYMBOL) CLOSE,HIGH(SYMBOL) HIGH,LOW(SYMBOL) LOW
FROM STOCK
ORDER BY OPEN DESC;