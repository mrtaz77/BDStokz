# Sample users and passwords

|USER TYPE|NAME|PASSWD|
|-|-|-|
|Admin|icarus77|stockpulse77|
|Admin|em09|stockpulse09|
|Corporation|Mokhles Pharma|mokPharma69|
|Cusomer|EEE cdi|washedUpMac|
|Customer|Lesli Chelam|oF7"kok$2AZqSI|
|Customer|KuDDus er pAAp|tZ5~0b0{c"|
|Customer|Shomiti Korboi|wO2,ik9<|
|Broker|Aangul Kata Jaglu|kK6//mmcG&hvKJ|

All passwords are first base64 encoded and then encrypted using SHA-512.

If you wish , you can change the password of all users simply by running the following script 
```sql
UPDATE "USER"
SET PWD = PWD_HASH('your_password');
```
