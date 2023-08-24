CREATE OR REPLACE TRIGGER user_id_trigger
BEFORE INSERT ON "USER"
FOR EACH ROW
BEGIN
    :NEW.USER_ID := user_id_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER employee_id_trigger
BEFORE INSERT ON "USER"
FOR EACH ROW
BEGIN
    :NEW.USER_ID := employee_id_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER order_id_trigger
BEFORE INSERT ON "USER"
FOR EACH ROW
BEGIN
    :NEW.USER_ID := order_id_seq.NEXTVAL;
END;
/

CREATE OR REPLACE TRIGGER activity_id_trigger
BEFORE INSERT ON "USER"
FOR EACH ROW
BEGIN
    :NEW.USER_ID := order_id_seq.NEXTVAL;
END;
/
