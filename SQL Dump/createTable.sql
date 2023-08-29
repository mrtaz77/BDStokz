-- dropping existing tables 
-- for first run,skip this part 

DROP SEQUENCE order_id_seq;
DROP SEQUENCE activity_id_seq;
DROP SEQUENCE user_id_seq;
DROP SEQUENCE employee_id_seq;

CREATE SEQUENCE user_id_seq START WITH 1000 INCREMENT BY 10 NOCACHE NOCYCLE;
CREATE SEQUENCE activity_id_seq START WITH 1000 INCREMENT BY 10 NOCACHE NOCYCLE;
CREATE SEQUENCE order_id_seq START WITH 10 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE employee_id_seq START WITH 100 INCREMENT BY 10 NOCACHE NOCYCLE;


DROP TABLE OWNS;
DROP TABLE "ORDER";
DROP TABLE PORTFOLIO;
DROP TABLE CUSTOMER;
DROP TABLE PARTICIPATION;
DROP TABLE BROKER;
DROP TABLE ACTIVITY;
DROP TABLE "BACKUP STOCK";
DROP TABLE STOCK;
DROP TABLE CORPORATION;
DROP TABLE ADMIN;
DROP TABLE USER_CONTACT;
DROP TABLE "USER";
DROP TABLE EMP_CONTACT;
DROP TABLE EMPLOYEE;



--  user table
CREATE TABLE "USER" (
    USER_ID INTEGER DEFAULT user_id_seq.NEXTVAL NOT NULL,
    NAME VARCHAR2 (100) NOT NULL,
    PWD VARCHAR2 (128) NOT NULL,
    EMAIL VARCHAR2 (255) NOT NULL,
    "TYPE" VARCHAR2 (30) NOT NULL,
    STREET_NO VARCHAR2(10),
    STREET_NAME VARCHAR2(100),
    CITY VARCHAR2(20) NOT NULL,
    COUNTRY VARCHAR2(30) NOT NULL,
    ZIP VARCHAR2(12) NOT NULL,
    REG_DATE DATE NOT NULL,
    CONSTRAINT PK_USER PRIMARY KEY (USER_ID),
    CONSTRAINT CHK_PWD_LENGTH CHECK (LENGTH(PWD) = 128),
    CONSTRAINT CHK_USER_EMAIL_FORMAT CHECK (REGEXP_LIKE(EMAIL, '[a-z0-9]+@[a-z]+\.[a-z]{2,3}', 'i')),
    CONSTRAINT CHK_USER_TYPE CHECK("TYPE" IN ('Admin','Corp','Broker','Customer')),
    CONSTRAINT CHK_REG_DATE CHECK(REG_DATE > TO_DATE('1-1-2015','DD-MM-YYYY'))
);

CREATE TABLE USER_CONTACT (
    USER_ID INTEGER NOT NULL,
    CONTACT VARCHAR ( 20 ) NOT NULL,
    CONSTRAINT PK_USER_CONTACT PRIMARY KEY ( USER_ID, CONTACT ),
    CONSTRAINT CHK_CONTACT_FORMAT CHECK ( REGEXP_LIKE ( CONTACT, '^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$' ) ),
    CONSTRAINT FK_USER_CONTACT_USER_ID FOREIGN KEY ( USER_ID ) REFERENCES "USER" ( USER_ID ) 
        ON DELETE CASCADE 
);

--  employee table
CREATE TABLE EMPLOYEE (
    EMPLOYEE_ID  INTEGER DEFAULT employee_id_seq.NEXTVAL NOT NULL,
    FIRST_NAME VARCHAR2 ( 50 ) NOT NULL,
    LAST_NAME VARCHAR2 ( 50 ) NOT NULL,
	EMAIL VARCHAR2 (255) NOT NULL,
    SEX CHAR(1) ,
    NID VARCHAR2 ( 20 ) ,
    DESIGNATION VARCHAR2 ( 100 ),
    ADDRESS VARCHAR2 ( 100 ),
    ZIP_CODE VARCHAR2 ( 10 ),
    SALARY NUMBER ( 10, 2 ),
    HIRE_DATE DATE ,
    DOB DATE ,
    MANAGER_ID INTEGER,
    CONSTRAINT PK_EMPLOYEE PRIMARY KEY ( EMPLOYEE_ID ),
    CONSTRAINT CHK_EMPLOYEE_SEX CHECK (SEX in ('M', 'F')),
    CONSTRAINT CHK_EMPLOYEE_NID CHECK (REGEXP_LIKE(NID, '^[0-9]+$')),
	CONSTRAINT CHK_EMP_EMAIL_FORMAT CHECK (REGEXP_LIKE(EMAIL, '[a-z0-9]+@[a-z]+\.[a-z]{2,3}', 'i')),
    CONSTRAINT CHK_EMPLOYEE_HIRE_DATE CHECK (HIRE_DATE > TO_DATE('2015-01-01', 'YYYY-MM-DD')),
    CONSTRAINT CHK_EMPLOYEE_DOB CHECK (EXTRACT(YEAR FROM DOB) > 1900),
    CONSTRAINT FK_EMPLOYEE_MANAGER_ID FOREIGN KEY ( MANAGER_ID ) REFERENCES EMPLOYEE ( EMPLOYEE_ID ) 
);



CREATE TABLE EMP_CONTACT (
    EMPLOYEE_ID INTEGER NOT NULL,
    CONTACT VARCHAR ( 20 ) NOT NULL ,
    CONSTRAINT PK_EMP_CONTACT PRIMARY KEY ( EMPLOYEE_ID, CONTACT ),
    CONSTRAINT FK_EMP_CONTACT_EMPLOYEE_ID FOREIGN KEY ( EMPLOYEE_ID ) REFERENCES EMPLOYEE ( EMPLOYEE_ID ) ON DELETE CASCADE ,
		CONSTRAINT CHK_EMP_CONTACT_CONTACT CHECK ( REGEXP_LIKE ( CONTACT, '^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$' ) )
);



-- admin table 
CREATE TABLE ADMIN(
    ADMIN_ID INTEGER NOT NULL,
    ADDER_ID INTEGER,
    EMPLOYEE_ID INTEGER NOT NULL,
    CONSTRAINT PK_ADMIN PRIMARY KEY(ADMIN_ID),
    CONSTRAINT FK_ADMIN_USER_ID FOREIGN KEY(ADMIN_ID) REFERENCES "USER" ( USER_ID ) 
        ON DELETE CASCADE,
    CONSTRAINT FK_ADMIN_EMPLOYEE_ID FOREIGN KEY(EMPLOYEE_ID) REFERENCES EMPLOYEE ( EMPLOYEE_ID ) 
        ON DELETE CASCADE,
    CONSTRAINT FK_ADMIN_ADDER_ID FOREIGN KEY(ADDER_ID) REFERENCES ADMIN(ADMIN_ID)
);



-- corporation table 
CREATE TABLE CORPORATION(
    CORP_ID INTEGER NOT NULL,
    CORP_REG_NO INTEGER NOT NULL,
    SECTOR VARCHAR2(30) NOT NULL,
    CONSTRAINT PK_CORPORATION PRIMARY KEY(CORP_ID),
    CONSTRAINT FK_CORPORATION_USER_ID FOREIGN KEY(CORP_ID) REFERENCES "USER" ( USER_ID ) 
        ON DELETE CASCADE
);


--	stock table 
CREATE TABLE STOCK (
    SYMBOL VARCHAR2(10) NOT NULL,
    CORP_ID INTEGER,
    UPDATE_TIME TIMESTAMP NOT NULL,
    VALUE NUMBER(10, 2) NOT NULL,
    PRICE NUMBER(10, 2) NOT NULL,
    LTP NUMBER(10, 2) NOT NULL,
    AVAILABLE_LOTS INTEGER ,
    LOT INTEGER,
    BLOCKED CHAR(1) ,
    CONSTRAINT CHK_BLOCKED CHECK (BLOCKED IN ('T', 'F')),
    CONSTRAINT PK_STOCK_SYMBOL PRIMARY KEY (SYMBOL),
    CONSTRAINT FK_STOCK_CORP_ID FOREIGN KEY (CORP_ID) REFERENCES CORPORATION (CORP_ID) ON DELETE SET NULL,
    CONSTRAINT CHK_STOCK_NON_NEGATIVE CHECK (PRICE >= 0 AND VALUE >= 0 AND LTP >= 0 AND AVAILABLE_LOTS >= 0)
);


-- backup stock 
CREATE TABLE "BACKUP STOCK" (
	SYMBOL VARCHAR2 ( 10 ) NOT NULL,
	UPDATE_TIME TIMESTAMP NOT NULL,
	VALUE NUMBER ( 10, 2 ) NOT NULL,
	PRICE NUMBER ( 10, 2 ) NOT NULL,
	AVAILABLE_LOTS INTEGER,
	CONTROLLER_ID INTEGER,
	CONSTRAINT PK_BACKUP_STOCK PRIMARY KEY ( SYMBOL ),
	CONSTRAINT FK_BACKUP_STOCK_CONTROLLER_ID FOREIGN KEY ( CONTROLLER_ID ) REFERENCES ADMIN ( ADMIN_ID ) 
		ON DELETE SET NULL,
	CONSTRAINT CHK_BACKUP_STOCK_NON_NEGATIVE CHECK ( PRICE >= 0 AND VALUE >= 0 AND AVAILABLE_LOTS >= 0 ) 
);






-- activity table 

CREATE TABLE ACTIVITY (
    ACTIVITY_ID INTEGER DEFAULT activity_id_seq.NEXTVAL NOT NULL,
    CORP_ID INTEGER NOT NULL,
    "DATE" DATE NOT NULL ,
    START_TIME TIMESTAMP NOT NULL,
    "DURATION(min)" NUMBER(10,0) NOT NULL,
    "TYPE" VARCHAR2 ( 50 ) NOT NULL,
    VENUE VARCHAR2 ( 100 ),
    FEE NUMBER ( 10, 2 ),
    DESCRIPTION VARCHAR2 ( 200 ),
    CONSTRAINT PK_ACTIVITY PRIMARY KEY ( ACTIVITY_ID ),
    CONSTRAINT CHK_ACTIVITY_DATE CHECK ("DATE" > TO_DATE('1-1-2015','DD-MM-YYYY')),
    CONSTRAINT FK_ACTIVITY_CORP_ID FOREIGN KEY ( CORP_ID ) REFERENCES CORPORATION ( CORP_ID ) 
        ON DELETE CASCADE
);


-- participation table 
CREATE TABLE PARTICIPATION (
    ACTIVITY_ID INTEGER NOT NULL,
    USER_ID INTEGER NOT NULL,
    PMT_STATUS VARCHAR2 ( 10 ) ,
	CONSTRAINT CHK_PMT_STATUS CHECK ( PMT_STATUS IN ( 'Paid', 'Not Paid' ) ),
    CONSTRAINT PK_PARTICIPATION PRIMARY KEY ( ACTIVITY_ID, USER_ID ),
    CONSTRAINT FK_PARTICIPATION_ACTIVITY_ID FOREIGN KEY ( ACTIVITY_ID ) REFERENCES ACTIVITY ( ACTIVITY_ID )
        ON DELETE CASCADE,
    CONSTRAINT FK_PARTICIPATION_USER_ID FOREIGN KEY ( USER_ID ) REFERENCES "USER" ( USER_ID ) 
        ON DELETE CASCADE
);


-- broker table 
CREATE TABLE BROKER (
    USER_ID INTEGER NOT NULL,
    LICENSE_NO VARCHAR2(20) NOT NULL,
    COMMISSION_PCT NUMBER(5, 2),
    EXPERTISE VARCHAR2(100),
    CONSTRAINT PK_BROKER PRIMARY KEY (USER_ID),
    CONSTRAINT FK_BROKER_USER_ID FOREIGN KEY (USER_ID) REFERENCES "USER" (USER_ID)
        ON DELETE CASCADE
);


-- customer table 
CREATE TABLE CUSTOMER (
    USER_ID INTEGER,
    ACCOUNT_NO VARCHAR2(20) NOT NULL,
    REFERER_ID INTEGER,
    REFER_COUNT INTEGER DEFAULT 0,
    BROKER_ID INTEGER,
    CONSTRAINT PK_CUSTOMER PRIMARY KEY (USER_ID),
    CONSTRAINT FK_CUSTOMER_BROKER_ID FOREIGN KEY (BROKER_ID) REFERENCES BROKER (USER_ID) ON DELETE SET NULL,
    CONSTRAINT FK_CUSTOMER_USER_ID FOREIGN KEY (USER_ID) REFERENCES "USER" (USER_ID) ON DELETE CASCADE,
    CONSTRAINT FK_CUSTOMER_REFER_ID FOREIGN KEY (REFERER_ID) REFERENCES CUSTOMER (USER_ID) ON DELETE SET NULL
);





-- portfolio table 
CREATE TABLE PORTFOLIO (
    USER_ID INTEGER NOT NULL,
    SECTOR VARCHAR2(30) NOT NULL,
    BUY_AMOUNT NUMBER(10, 2),
    SELL_AMOUNT NUMBER(10, 2),
    CASH_AMOUNT NUMBER(10, 2),
    CONSTRAINT PK_PORTFOLIO PRIMARY KEY (USER_ID, SECTOR),
    CONSTRAINT FK_PORTFOLIO_USER_ID FOREIGN KEY (USER_ID) REFERENCES CUSTOMER (USER_ID) ON DELETE CASCADE
);


-- order table 

CREATE TABLE "ORDER" (
    ORDER_ID INTEGER DEFAULT order_id_seq.NEXTVAL NOT NULL,
    SYMBOL VARCHAR2(10) NOT NULL,
    USER_ID INTEGER NOT NULL,
    SECTOR VARCHAR2(30) NOT NULL,
    STATUS VARCHAR2(20) ,
    "TYPE" VARCHAR2(10) ,
    LATEST_PRICE NUMBER(10, 2) DEFAULT 0,
    LATEST_QUANTITY INTEGER DEFAULT 0,
    LATEST_UPDATE_TIME TIMESTAMP,
    TRANSACTION_FEE NUMBER(10, 2) DEFAULT 0,
    TRANSACTION_TIME TIMESTAMP,
    CONSTRAINT PK_ORDER PRIMARY KEY(ORDER_ID),
    CONSTRAINT FK_ORDER_SYMBOL FOREIGN KEY(SYMBOL) REFERENCES STOCK(SYMBOL) ON DELETE SET NULL,
    CONSTRAINT FK_ORDER_USER_PORTFOLIO FOREIGN KEY(USER_ID, SECTOR) REFERENCES PORTFOLIO(USER_ID, SECTOR) ON DELETE CASCADE,
    CONSTRAINT CHK_ORDER_PRICES CHECK(LATEST_PRICE >= 0 AND LATEST_QUANTITY >=0 AND TRANSACTION_FEE >= 0),
    CONSTRAINT CHK_ORDER_STATUS CHECK (UPPER(STATUS) IN ('PENDING','COMPLETE')),
    CONSTRAINT CHK_ORDER_TYPE CHECK (UPPER("TYPE") IN ('BUY','SELL'))
);


-- owns table 
CREATE TABLE OWNS(
    USER_ID INTEGER NOT NULL,
    SECTOR VARCHAR2(30) NOT NULL,
    SYMBOL VARCHAR2(10) NOT NULL,
    QUANTITY INTEGER DEFAULT(0),
    CONSTRAINT PK_OWNS PRIMARY KEY(USER_ID),
    CONSTRAINT FK_OWNS_PORTFOLIO FOREIGN KEY(USER_ID, SECTOR) REFERENCES PORTFOLIO(USER_ID, SECTOR) ON DELETE CASCADE,
    CONSTRAINT FK_OWNS_STOCK FOREIGN KEY(SYMBOL) REFERENCES STOCK(SYMBOL) ON DELETE SET NULL
);

ALTER TABLE EMPLOYEE
ADD CONSTRAINT CHK_SALARY_RANGE CHECK (SALARY BETWEEN 10000.00 AND 1000000.00);

ALTER TABLE USER_CONTACT
ADD CONSTRAINT UK_USER_CONTACT UNIQUE (CONTACT);

ALTER TABLE EMP_CONTACT
ADD CONSTRAINT UK_EMP_CONTACT UNIQUE (CONTACT);


ALTER TABLE "USER" 
DROP CONSTRAINT CHK_REG_DATE;

ALTER TABLE "USER" 
ADD CONSTRAINT CHK_REG_DATE CHECK(REG_DATE >= TO_DATE('2015-01-01', 'YYYY-MM-DD'));

ALTER TABLE "USER"
MODIFY CITY VARCHAR2(50);

ALTER TABLE "USER"
DROP CONSTRAINT CHK_USER_EMAIL_FORMAT;

ALTER TABLE "USER"
ADD CONSTRAINT CHK_USER_EMAIL_FORMAT  CHECK (REGEXP_LIKE(EMAIL, '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]{2,}$'));

ALTER TABLE "USER"
MODIFY COUNTRY VARCHAR2(50);


ALTER TABLE EMPLOYEE
DROP CONSTRAINT CHK_EMPLOYEE_HIRE_DATE;

ALTER TABLE EMPLOYEE
ADD CONSTRAINT CHK_EMPLOYEE_HIRE_DATE CHECK (HIRE_DATE >= TO_DATE('2014-11-01', 'YYYY-MM-DD'));

ALTER TABLE EMPLOYEE
DROP CONSTRAINT CHK_EMPLOYEE_NID ;

ALTER TABLE EMPLOYEE
ADD CONSTRAINT CHK_EMPLOYEE_NID CHECK (REGEXP_LIKE(NID, '^\d{3}-\d{2}-\d{4}$'));

ALTER TABLE EMPLOYEE
ADD CONSTRAINT UK_EMPLOYEE_NID UNIQUE(NID);


ALTER TABLE EMPLOYEE
DROP CONSTRAINT CHK_EMPLOYEE_EMAIL_FORMAT;

ALTER TABLE EMPLOYEE
ADD CONSTRAINT CHK_EMPLOYEE_EMAIL_FORMAT  CHECK (REGEXP_LIKE(EMAIL, '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]{2,}$'));



ALTER TABLE CORPORATION
ADD CONSTRAINT UK_CORPORATION_CORP_REG_NO UNIQUE(CORP_REG_NO);

ALTER TABLE "ORDER"
DROP CONSTRAINT CHK_ORDER_STATUS;

ALTER TABLE "ORDER"
ADD CONSTRAINT CHK_ORDER_STATUS CHECK (UPPER(STATUS) IN ('PENDING','SUCCESS','FAILURE'));

ALTER TABLE CUSTOMER
ADD CONSTRAINT UK_ACCOUNT_NO UNIQUE(ACCOUNT_NO);

ALTER TABLE "USER"
ADD CONSTRAINT UK_USER_EMAIL UNIQUE (EMAIL);



ALTER TABLE ADMIN
ADD FUNDS DECIMAL(10,2);

ALTER TABLE PARTICIPATION
DROP COLUMN PMT_STATUS;
