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
	COUNT( DISTINCT TABLE_NAME ) 
FROM
	all_tab_columns 
WHERE
	owner = 'C##STOCKDB';


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
	

SELECT
	table_name,
	num_rows 
FROM
	all_tables 
WHERE
	owner = 'C##STOCKDB' 
ORDER BY
	TABLE_NAME;





