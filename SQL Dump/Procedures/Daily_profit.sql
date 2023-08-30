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
    SELECT DISTINCT
      C.SECTOR,
      SUM(NVL(O1.TRANSACTION_FEE, 0)) PROFIT
    FROM
      CORPORATION C LEFT OUTER JOIN "ORDER" O1 ON C.SECTOR = O1.SECTOR
    WHERE
      TRUNC(O1.TRANSACTION_TIME) >= ALL (SELECT TRUNC(O2.TRANSACTION_TIME) FROM "ORDER" O2 WHERE
        O2.SECTOR = O1.SECTOR
      )
    GROUP BY
      C.SECTOR,
      TRUNC(O1.TRANSACTION_TIME)
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