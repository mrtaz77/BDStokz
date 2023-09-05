CREATE OR REPLACE TRIGGER checkBackupConstraint
BEFORE INSERT OR UPDATE OF SYMBOL ON "BACKUP STOCK"
FOR EACH ROW
DECLARE
    v_stock_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_stock_count
    FROM STOCK
    WHERE SYMBOL = :NEW.SYMBOL;

    IF v_stock_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Stock symbol does not exist in STOCK table');
    END IF;
END;
/