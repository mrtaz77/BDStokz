CREATE OR REPLACE FUNCTION SECTOR_OF_STOCK(SYM IN VARCHAR2)RETURN VARCHAR2 IS
SEC VARCHAR2(40);
BEGIN
SELECT SECTOR INTO SEC FROM CORPORATION NATURAL JOIN STOCK WHERE SYMBOL = SYM;
RETURN SEC;
EXCEPTION
	WHEN OTHERS THEN RETURN '';
END;


CREATE OR REPLACE PROCEDURE DAILY_PROFIT(profits OUT VARCHAR2) IS
  -- Declare a collection to hold the result records
  TYPE profit_record_type IS RECORD (
    sector VARCHAR2(255),
    profit DECIMAL(10, 2)
  );

  TYPE profit_list_type IS TABLE OF profit_record_type;
  v_sector_profits profit_list_type;

  -- Cursor to fetch the data
  CURSOR c_sector_profits IS
      SELECT
        C.SECTOR,
        SUM( NVL( D.TRANSACTION_FEE, 0 ) ) PROFIT 
      FROM
        ( SELECT DISTINCT SECTOR FROM CORPORATION ) C LEFT OUTER
        JOIN (
        SELECT
          SECTOR_OF_STOCK ( O1.SYMBOL ) SECTOR,
          O1.TRANSACTION_FEE,
          TRUNC( O1.TRANSACTION_TIME ) 
        FROM
          "ORDER" O1 
        WHERE
          O1.STATUS = 'SUCCESS' 
          AND TRUNC( O1.TRANSACTION_TIME ) >= ALL (
          SELECT
            TRUNC( O2.TRANSACTION_TIME ) 
          FROM
            "ORDER" O2 
          WHERE
            SECTOR_OF_STOCK ( O2.SYMBOL ) = SECTOR_OF_STOCK ( O1.SYMBOL ) 
            AND O2.STATUS = 'SUCCESS' 
          ) 
        ) D ON C.SECTOR = D.SECTOR 
      GROUP BY
        C.SECTOR 
      ORDER BY
        C.SECTOR;


  v_json VARCHAR2(32767) := ''; -- Initialize JSON object

BEGIN
  -- Open the cursor and fetch data into the collection
  OPEN c_sector_profits;
  FETCH c_sector_profits BULK COLLECT INTO v_sector_profits;
  CLOSE c_sector_profits;

  FOR i IN v_sector_profits.FIRST .. v_sector_profits.LAST LOOP
    -- Append each record as a JSON object
    v_json := v_json || ', {"sector": "' || v_sector_profits(i).sector ||
                           '", "profit": ' || v_sector_profits(i).profit || '}';
  END LOOP;

  -- Wrap the JSON object
  v_json := '{"data": [' || SUBSTR(v_json, 2) || ']}';

  -- Set the output parameter
  profits := v_json;
END;

DECLARE
  POP VARCHAR2(32767);
BEGIN
  DAILY_PROFIT(POP);
	DBMS_OUTPUT.PUT_LINE(POP);
END;