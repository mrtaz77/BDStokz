# Index of the DB
#### [ORDER_TRANSACTION_TIME_STATUS_IDX](#order_transaction_time_status_idx-1)
#### [CORPORATION_SECTOR_IDX](#corporation_sector_idx-1)
#### [USER_LOG_USER_ID_IDX](#user_log_user_id_idx-1)
#### [ORDER_SYMBOL_IDX](#order_symbol_idx-1)

## ORDER_TRANSACTION_TIME_STATUS_IDX
```sql
CREATE INDEX ORDER_TRANSACTION_TIME_STATUS_IDX 
ON "ORDER"(TRANSACTION_TIME,STATUS);	
```

## CORPORATION_SECTOR_IDX 
```sql
CREATE INDEX CORPORATION_SECTOR_IDX 
ON CORPORATION(SECTOR);	
```

## USER_LOG_USER_ID_IDX 
```sql
CREATE INDEX USER_LOG_USER_ID_IDX 
ON USER_LOG(USER_ID);
```

## ORDER_SYMBOL_IDX 
```sql
CREATE INDEX ORDER_SYMBOL_IDX 
ON "ORDER"(SYMBOL);
```





