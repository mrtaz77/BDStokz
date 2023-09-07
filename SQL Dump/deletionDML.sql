ALTER TABLE "USER" ADD COLUMN IS_DELETED VARCHAR2(2) DEFAULT 'F';
ALTER TABLE EMPLOYEE ADD COLUMN IS_DELETED VARCHAR2(2) DEFAULT 'F';
ALTER TABLE CUSTOMER ADD COLUMN IS_DELETED VARCHAR2(2) DEFAULT 'F';
ALTER TABLE CORPORATION ADD COLUMN IS_DELETED VARCHAR2(2) DEFAULT 'F';
ALTER TABLE BROKER ADD COLUMN IS_DELETED VARCHAR2(2) DEFAULT 'F';
ALTER TABLE ADMIN ADD COLUMN IS_DELETED VARCHAR2(2) DEFAULT 'F';
ALTER TABLE "BACKUP STOCK" ADD COLUMN BLOCKED VARCHAR2(2) DEFAULT 'F';

ALTER TABLE "USER" ADD CONSTRAINT USER_DELETED_CHECK CHECK (IS_DELETED IN (:NEW.IS_DELETED, 'F'));
ALTER TABLE EMPLOYEE ADD CONSTRAINT EMP_DELETED_CHECK CHECK (IS_DELETED IN (:NEW.IS_DELETED, 'F'));
ALTER TABLE CUSTOMER ADD CONSTRAINT CUSTOMER_DELETED_CHECK CHECK (IS_DELETED IN (:NEW.IS_DELETED, 'F'));
ALTER TABLE CORPORATION ADD CONSTRAINT CORP_DELETED_CHECK CHECK (IS_DELETED IN (:NEW.IS_DELETED, 'F'));
ALTER TABLE BROKER ADD CONSTRAINT BROKER_DELETED_CHECK CHECK (IS_DELETED IN (:NEW.IS_DELETED, 'F'));
ALTER TABLE ADMIN ADD CONSTRAINT ADMIN_DELETED_CHECK CHECK (IS_DELETED IN (:NEW.IS_DELETED, 'F'));
ALTER TABLE "BACKUP STOCK" ADD CONSTRAINT BS_BLOCKED_CHECK CHECK (BLOCKED IN (:NEW.IS_DELETED, 'F'));

UPDATE "USER" SET IS_DELETED = 'F';
UPDATE EMPLOYEE SET IS_DELETED = 'F';
UPDATE CUSTOMER SET IS_DELETED = 'F';
UPDATE CORPORATION SET IS_DELETED = 'F';
UPDATE BROKER SET IS_DELETED = 'F';
UPDATE ADMIN SET IS_DELETED = 'F';
UPDATE "BACKUP STOCK" SET BLOCKED = 'F';