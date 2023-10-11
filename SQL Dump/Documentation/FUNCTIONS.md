## Function for calculating commission percentage of  a broker. 
- The funcion takes as input the id of the broker and returns his/her commission percentage.
- The range of commission percentage lies between 0.01 and 4.
- For every 100000 shares (latest_quantity) transaction done via successful orders of the customers of the broker, the percentage will increase by 1.
- The broker and customers under calculation must have active accounts in the website.

### Prerequisites 
| Tables | Attributes |
| :---:   | :---: |
| ORDER | STATUS, SUCCESS , USER_ID |
| CUSTOMER | USER_ID , IS_DELETED , BROKER_ID |
| BROKER | USER_ID , IS_DELETED |



```sql
CREATE OR REPLACE FUNCTION broker_commission_pct (BID IN NUMBER) RETURN NUMBER IS 
COM_PCT NUMBER (5,2);
CHK_BID NUMBER; 
BEGIN 
SELECT COUNT(USER_ID) INTO CHK_BID FROM BROKER WHERE USER_ID = BID AND IS_DELETED = 'F';

IF CHK_BID = 0 THEN 
	RETURN 0;
ELSE 
SELECT LEAST(0.01 + ROUND(NVL(SUM(LATEST_QUANTITY),0)/100000,0)*0.01,4) INTO COM_PCT
FROM CUSTOMER LEFT OUTER JOIN "ORDER" ON "ORDER".USER_ID = CUSTOMER.USER_ID
WHERE STATUS = 'SUCCESS' AND BROKER_ID = BID AND CUSTOMER.IS_DELETED = 'F';
END  IF;
RETURN COM_PCT;
EXCEPTION
WHEN OTHERS THEN 
	RETURN 0;
END;
/
```