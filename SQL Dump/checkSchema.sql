SELECT
	table_name,
	column_name,
	data_type,
	DATA_LENGTH 
FROM
	all_tab_columns 
WHERE
	owner = 'C##STOCKDB' 
ORDER BY
	TABLE_NAME,
	COLUMN_NAME;

SELECT
	COUNT( DISTINCT TABLE_NAME ) NUM_TABLES
FROM
	all_tab_columns 
WHERE
	owner = 'C##STOCKDB'
ORDER BY
	TABLE_NAME;
	
	
SELECT
	table_name,
	constraint_name,
	constraint_type 
FROM
	all_constraints 
WHERE
	owner = 'C##STOCKDB' 
	AND TABLE_NAME IN ( SELECT DISTINCT table_name FROM all_tab_columns WHERE owner = 'C##STOCKDB' ) 
	AND constraint_name NOT LIKE '%SYS%'
ORDER BY
	TABLE_NAME,
	CONSTRAINT_NAME;

-- viewing table rows

DECLARE
    v_table_name VARCHAR2(30);
    v_row_count  NUMBER;
BEGIN
    FOR tab IN (SELECT table_name FROM all_tables WHERE owner = 'C##STOCKDB') LOOP
        v_table_name := tab.table_name;
        
        EXECUTE IMMEDIATE 'SELECT COUNT(*) FROM C##STOCKDB."' || v_table_name || '"' INTO v_row_count;
        
        DBMS_OUTPUT.PUT_LINE('Table ' || v_table_name || ': ' || v_row_count || ' rows');
    END LOOP;
END;
/





-- USER CHECK
SELECT "TYPE",MIN(USER_ID),MAX(USER_ID) FROM "USER" GROUP BY "TYPE";
SELECT COUNT(*) FROM "USER" GROUP BY "TYPE";
SELECT USER_ID,NAME FROM "USER" WHERE "TYPE" = 'Corp' ORDER BY USER_ID;

SELECT NAME,STREET_NO||' '||STREET_NAME,ZIP FROM "USER" WHERE "TYPE" = 'Admin';

-- EMPLOYEE CHECK
SELECT * FROM EMPLOYEE;
SELECT
	USER_ID,
	EMPLOYEE_ID 
FROM
	"USER",
	EMPLOYEE 
WHERE
	"USER".NAME = EMPLOYEE.FIRST_NAME || ' ' || EMPLOYEE.LAST_NAME 
	OR "USER".NAME = EMPLOYEE.FIRST_NAME || EMPLOYEE.LAST_NAME
ORDER BY USER_ID;

-- 