# NFC-URL-Payload-for-XUMM

#V1 ARC122u Folder

Send XUMM URL Payload over NFC using a ARC122u Reader and Mifare Ultralight Cards. 
Read with RN App NFC.

Requires drives for ARC122u and Mirfare Ultralight Cards.

https://youtu.be/wXKmlSJzGGc small video

#V2 PN532 folder

an adaption of https://github.com/rslater12/XUMM_PoS

Tried to write the Xumm payload into teh C++ code but failed, tried a few ways, Addons probably seems the best way.

Currently iv opted to write the file again and then make/rebuild it before presenting payload to reader.

once Lib NFC is installed, try dropping the files in PN532 into the Utils folder of teh Lib NFC and then run 

>Add Xumm Developer API Keys to env file and rename to .env

>npm i

> node ./bin/www


#iOS App

iOS App in order to allow an Iphone to read the Xumm Payload

