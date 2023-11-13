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
For passwd of any other user, go to [USERS](/SQL%20Dump/PopulateTableUtil/USER/) , search in the pwd column.There will be a `base64` string.Decode it from base64 and you will get the password of that user.